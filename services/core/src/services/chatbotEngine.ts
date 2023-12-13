import {
	IncomingMessage,
	MessageConfig,
	MessageType,
	OutGoingMessage,
} from "../apiSchemas/message";
import { FLOW_CLASSNAME, SESSION_CLASSNAME } from "../dbSchemas/chatbot";
import { cloneDeep, get, head, isEmpty, last, reduce } from "lodash";
import {
	ActionData,
	ActionType,
	APIAction,
	DHIS2APIAction,
	InputAction,
	MenuAction,
	MenuOption,
	QuitAction,
	RouterAction,
	VisualizerAction,
} from "../apiSchemas/flow";
import axios, { AxiosResponse, ResponseType } from "axios";
import { getVisualization } from "../utils/visualization";

export class ChatbotEngine {
	protected session?: Parse.Object;
	protected message: IncomingMessage;
	protected client?: Parse.Object;

	constructor({
		message,
		session,
		client,
	}: {
		session: Parse.Object;
		message: IncomingMessage;
		client?: Parse.Object;
	}) {
		this.session = session;
		this.message = message;
		this.client = client;
	}

	protected get sessionData(): Record<string, any> {
		return this.session?.get("data");
	}

	protected get dhis2Instance(): Parse.Object {
		return this.client.get("dhis2Instance");
	}

	protected get sessionStep(): "WAITING" | "COMPLETED" {
		return this.session?.get("step");
	}

	protected get sessionState() {
		return this.session?.get("state");
	}

	public static async init({
		message,
		client,
	}: {
		message: IncomingMessage;
		client: Parse.Object;
	}) {
		const { from } = message;
		const identifier = from.number;
		const sessionQuery = new Parse.Query(SESSION_CLASSNAME);
		sessionQuery.equalTo("contactIdentifier", identifier);
		sessionQuery.equalTo("client", client);
		const session = await sessionQuery.first({ useMasterKey: true });
		if (!session) {
			//New session
			//Get flow
			await client.fetchWithInclude(["dhis2Instance"]);
			const flowQuery = new Parse.Query(FLOW_CLASSNAME);
			flowQuery.equalTo("dhis2Instance", client.get("dhis2Instance"));
			// flowQuery.containedIn("clients", [client]); //TODO: Enable this in prod
			flowQuery.contains("trigger", message.message.text);
			const flows = await flowQuery.find({ useMasterKey: true });

			if (isEmpty(flows)) {
				throw Error(
					`Sorry could not understand the keyword ${message.message.text}. Please try again.`,
				);
			}

			if (flows.length > 1) {
				throw Error(
					`More than one service matches the given phrase ${
						message.message.text
					}. To start an available service, use any of the following phrases: \\n${flows.map(
						(flow) => `- ${flow.get("trigger")}\n`,
					)}`,
				);
			}

			const newSession = new Parse.Object(SESSION_CLASSNAME);
			await newSession.save(
				{
					contactIdentifier: identifier,
					client,
					startTime: new Date(),
					data: {},
					flow: head(flows),
				},
				{
					useMasterKey: true,
				},
			);
			await newSession.fetchWithInclude(["flow"]);
			return new ChatbotEngine({ message, session });
		}
		return new ChatbotEngine({ message, session });
	}

	async updateSession(field: string, value: any) {
		this.session?.set(field, value);
		await this.session?.save();
		return this.session;
	}

	async updateSessionData(key: string, data: unknown) {
		const updatedData = {
			...this.sessionData,
			[key]: data,
		};
		await this.updateSession("data", updatedData);
	}

	async updateSessionState(state: string) {
		await this.updateSession("state", state);
	}

	async cancelSession() {
		await this.updateSession("step", "COMPLETED");
		await this.updateSession("cancelled", true);
	}

	getReplyMessage(message: MessageConfig): OutGoingMessage {
		return {
			...message,
			to: [this.message.from],
		};
	}

	async runAction(): Promise<OutGoingMessage> | undefined {
		const currentState = cloneDeep(this.sessionState);
		const action = currentState.action as ActionData;
		if (this.message?.message.text?.toLowerCase().match("cancel")) {
			await this.cancelSession();
			return this.getReplyMessage({
				type: MessageType.CHAT,
				text: "Session cancelled.",
			});
		}

		let message: OutGoingMessage;
		switch (action.type) {
			case ActionType.MENU:
				message = await this.runMenuAction(action);
				break;
			case ActionType.INPUT:
				message = await this.runInputAction(action);
				break;
			case ActionType.API:
				await this.runAPIAction(action);
				break;
			case ActionType.DHIS2API:
				await this.runDHIS2APIAction(action);
				break;
			case ActionType.VISUALIZER:
				await this.runVisualizerAction(action);
				break;
			case ActionType.ROUTER:
				await this.runRouteAction(action);
				break;
			case ActionType.QUIT:
				message = await this.runQuitAction(action);
				break;
		}

		if (currentState.id !== this.sessionState?.id) {
			//State has changed, run the action again
			return await this.runAction();
		}
		if (message) {
			return message;
		}
		return null;
	}

	getSelectedMenuOption(options: MenuOption[]): string {
		const index = Number(this.message?.message?.text);
		let option = null;
		if (isNaN(index)) {
			//Try matching using string
			option = options.find(
				(option) => this.message?.message?.text?.match(option.text),
			);
		} else {
			//Yeey, we got a number
			option = options[index - 1];
		}
		if (!option) {
			throw Error("Invalid option");
		}
		return option.id;
	}

	mapOptions({
		dataKey,
		textKey,
		idKey,
	}: {
		dataKey: string;
		idKey: string;
		textKey: string;
	}): MenuOption[] {
		const data = this.sessionData;
		const rawOptions = get(data, [dataKey]) ?? [];
		return rawOptions.map((rawOption: Record<string, any>) => ({
			text: get(rawOption, [textKey]),
			id: get(rawOption, [idKey]),
		}));
	}

	async runAssignAction(action: MenuAction | InputAction) {
		const { text, dataKey, type } = action;
		const options = "options" in action ? action.options : null;
		const sanitizedOptions: MenuOption[] = Array.isArray(
			JSON.parse(options as string),
		)
			? JSON.parse(options as string)
			: this.mapOptions(JSON.parse(options as string));
		const value =
			type === "MENU"
				? this.getSelectedMenuOption(sanitizedOptions)
				: this.message?.message.text;
		await this.updateSessionData(dataKey as string, value);
		await this.updateSession("step", "COMPLETED");
		await this.updateSessionState(action.nextState as string);
	}

	async runMenuAction(action: MenuAction): Promise<OutGoingMessage> {
		const { options, text } = action;
		const sanitizedOptions: MenuOption[] = Array.isArray(options)
			? options
			: this.mapOptions(
					options as {
						dataKey: string;
						idKey: string;
						textKey: string;
					},
			  );
		if (this.sessionStep === "WAITING") {
			try {
				await this.runAssignAction(action);
			} catch (e: any) {
				if (e.message === "Invalid option") {
					throw Error(
						`Invalid option. Please select from the following options:\n \n ${sanitizedOptions
							.map(
								(option, index) =>
									`${index + 1}. ${option.text}`,
							)
							.join("\n")}`,
					);
				}
				throw e;
			}
			return null;
		}
		//Format the message using the options

		const formattedMessage = `${text} \n\n ${sanitizedOptions
			.map((option, index) => `${index + 1}. ${option.text}`)
			.join("\n")}`;
		//Set session step as waiting
		await this.updateSession("step", "WAITING");
		return this.getReplyMessage({
			type: MessageType.CHAT,
			text: formattedMessage,
		});
	}

	async runInputAction(action: InputAction): Promise<OutGoingMessage> {
		if (this.sessionStep === "WAITING") {
			await this.runAssignAction(action);
		}
		await this.updateSession("step", "WAITING");

		const sanitizedText = this.sanitizeText(action.text as string);

		return this.getReplyMessage({
			type: MessageType.CHAT,
			text: sanitizedText,
		});
	}

	async fetch({
		body,
		params,
		headers,
		method,
		responseType,
		url,
	}: {
		headers?: Record<string, any>;
		body?: Record<string, any>;
		params?: Record<string, any>;
		method?: "GET" | "POST";
		responseType: ResponseType;
		url: string;
	}) {
		const axiosInstance = axios.create({
			data: body,
			responseType: responseType ?? "json",
			headers: {
				"Content-Type": "application/json",
				...(headers ?? {}),
			},
			method: method ?? "GET",
			params: params,
		});
		try {
			const response =
				method === "POST"
					? await axiosInstance.post(url)
					: await axiosInstance.get(url);
			if ([200, 304].includes(response.status)) {
				//set data to data key
				return response.data;
			}
		} catch (e: any) {
			await this.closeSession();
			throw Error("Error calling webhook. " + e.message);
		}
	}

	async saveDataFromAPI({
		responseDataPath,
		responseType,
		response,
		dataKey,
		url,
	}: {
		response: AxiosResponse;
		responseType: ResponseType;
		responseDataPath: string;
		url: string;
		dataKey: string;
	}) {
		const dataValue = responseDataPath
			? get(response.data, responseDataPath)
			: response.data;
		if (responseType === "arraybuffer") {
			//A file, change it to base64 string so that it plays nice
			//assuming the end of url signifies the image extension;
			const extension = last(url.split(".")) as string;
			const validExtension = ["png", "jpg", "pdf"].includes(extension)
				? extension
				: "jpg";
			const image = `data:image/${validExtension};base64,${Buffer.from(
				dataValue,
				"binary",
			).toString("base64")}`;
			await this.updateSessionData(dataKey, image);
		} else {
			await this.updateSessionData(dataKey, dataValue);
		}
	}

	async runAPIAction(action: APIAction): Promise<void> {
		const { url, dataKey, nextState, urlOptions } = action;

		const {
			responseDataPath,
			responseType,
			method,
			body,
			params,
			headers,
		} = urlOptions ?? {};
		if (!url) {
			throw Error("Invalid webhook action. Missing url");
		}
		const sanitizedURL = this.replaceStringValues(url);
		const response = await this.fetch({
			headers,
			body,
			params,
			method,
			responseType,
			url: sanitizedURL,
		});
		if (dataKey) {
			await this.saveDataFromAPI({
				response,
				responseType,
				dataKey,
				url: sanitizedURL,
				responseDataPath,
			});
			if (nextState) {
				await this.updateSessionState(nextState);
			} else {
				throw Error("Missing next step to move to");
			}
		} else {
			throw Error("Missing data key to assign value to.");
		}
	}

	async runDHIS2APIAction(action: DHIS2APIAction): Promise<void> {
		const {
			resource,
			params,
			nextState,
			dataKey,
			method,
			responseDataPath,
		} = action ?? {};
		const url = `${this.dhis2Instance.get("url")}/api/${resource}`;
		const headers = {
			Authorization: `ApiToken ${this.dhis2Instance.get("pat")}`,
		};
		const response = await this.fetch({
			url,
			headers,
			params,
			method,
			responseType: "json",
		});
		if (dataKey) {
			await this.saveDataFromAPI({
				response,
				responseType: "json",
				dataKey,
				url,
				responseDataPath,
			});
			if (nextState) {
				await this.updateSessionState(nextState);
			} else {
				throw Error("Missing next step to move to");
			}
		} else {
			throw Error("Missing data key to assign value to.");
		}
	}

	async closeSession() {
		await this.updateSession("step", "COMPLETED");
		await this.updateSession("cancelled", true);
	}

	sanitizeText(text: string): string {
		return this.replaceStringValues(text);
	}

	sanitizeMessageFormat(messageFormat: string, text: string): string {
		const data = {
			text,
		};
		return this.replaceStringValues(messageFormat, data);
	}

	async runQuitAction(action: QuitAction): Promise<OutGoingMessage> {
		const { text, messageFormat } = action;
		await this.closeSession();
		const sanitizedText = this.sanitizeText(text as string);
		const sanitizedFormatString = messageFormat
			? this.sanitizeMessageFormat(messageFormat, sanitizedText)
			: undefined;
		const format = sanitizedFormatString
			? JSON.parse(sanitizedFormatString)
			: undefined;

		return this.getReplyMessage({
			type: format?.type ?? MessageType.CHAT,
			text: format?.text ?? sanitizedText,
			image: format?.image,
			file: format?.file,
		});
	}

	async runVisualizerAction(action: VisualizerAction): Promise<void> {
		const { visualizationId, dataKey } = action ?? {};
		const dhis2URL = this.dhis2Instance.get("url");
		const dhis2PAT = this.dhis2Instance.get("pat");
		const visualization = await getVisualization({
			dhis2URL,
			dhis2PAT,
			id: visualizationId,
		});
		await this.updateSessionData(dataKey, visualization);
	}

	replaceStringValues(text: string, extraData?: Record<string, any>): string {
		const contextData = {
			...this.sessionData,
			dhis2URL: this.dhis2Instance.get("url"),
			dhis2PAT: this.dhis2Instance.get("pat"),
			...(extraData ?? {}),
		};
		return reduce(
			Object.keys(contextData),
			(acc, curr) =>
				acc.replaceAll(
					new RegExp(`{${curr}}`, "g"),
					`${get(contextData, curr)}`,
				),
			text,
		);
	}

	async runRouteAction(action: RouterAction): Promise<void> {
		const { routes } = action;
		const route = routes.find((route) => {
			const sanitizedExpression = this.replaceStringValues(
				route.expression as string,
			);
			return eval(sanitizedExpression);
		});
		if (!route) {
			await this.updateSessionState(action.nextState as string);
		} else {
			await this.updateSessionState(route.nextState as string);
			await this.updateSession("step", "COMPLETED");
		}
	}
}
