import { BaseClient } from "../base";
import path from "path";
import {
	CatchQRCallback,
	Chat,
	create,
	Message,
	SocketState,
	StatusFindCallback,
	Whatsapp,
} from "@wppconnect-team/wppconnect";
import { activeWhatsappClients, removeClient } from "../../globals/whatsapp";
import { find } from "lodash";
import {
	ContactType,
	IncomingMessage,
	MessageType,
	OutgoingMessage,
	WhatsappContact,
} from "schemas";
import { asyncify, mapSeries } from "async";

import Parse from "parse/node";
import logger from "../../services/logging";
import { config } from "dotenv";

config();

Parse.serverURL = process.env.CORE_BASE_URL;
Parse.initialize(process.env.CORE_APP_ID);

export class WhatsappClient extends BaseClient<Whatsapp> {
	session: string;

	constructor(session: string) {
		super();
		this.session = session;
	}

	get folderLocation(): string {
		const [instanceId, ...sessionKey] = this.session.split("-");
		return `clients/whatsapp/${instanceId}/${sessionKey.join("-")}`;
	}

	get isActive(): boolean {
		return !!activeWhatsappClients.find(
			(client) => client.session === this.session,
		);
	}

	static get(session: string) {
		return find(activeWhatsappClients, ["session", session]);
	}

	async init(): Promise<WhatsappClient> {
		const whatsapp = await create({
			session: this.session,
			waitForLogin: false,
			folderNameToken: "clients/whatsapp",
			puppeteerOptions: {
				headless: "new",
				args: ["--no-sandbox"],
				userDataDir: path.join(
					__dirname,
					`../../../${this.folderLocation}`,
				),
			},
			debug: false,
			updatesLog: false,
		});
		if (whatsapp) {
			this.client = whatsapp;
			await this.client.start();
			activeWhatsappClients.push(this);
			this.setupMessageCallback();
			return this;
		}
		throw Error(`Could not initialize WhatsApp session ${this.session}`);
	}

	async stop(): Promise<WhatsappClient> {
		const success = await this.client.close();
		if (success) {
			removeClient(this.session);
			return this;
		}
		throw Error(`Could not stop the client with session ${this.session}`);
	}

	async setup({
		name,
		qrCallback,
		loadingCallback,
		onSuccess,
		onError,
		statusCallback,
	}: {
		name: string;
		qrCallback: CatchQRCallback;
		statusCallback: StatusFindCallback;
		loadingCallback: (percent: number, message: string) => void;
		onSuccess: () => void;
		onError: (e: any) => void;
	}): Promise<BaseClient<Whatsapp>> {
		try {
			if (this.isActive) {
				await this.client.logout();
			}

			this.client = await create({
				session: this.session,
				deviceName: `${name} WhatsApp Client`,
				statusFind: statusCallback,
				catchQR: qrCallback,
				waitForLogin: true,
				debug: process.env.NODE_ENV === "development",
				autoClose: 60 * 2 * 1000,
				devtools: process.env.NODE_ENV === "development",
				folderNameToken: this.folderLocation,
				puppeteerOptions: {
					headless: "new",
					args: ["--no-sandbox"],
					userDataDir: path.join(
						__dirname,
						`../../../${this.folderLocation}`,
					),
				},
				poweredBy: "DHIS2 Analytics Messenger",
				onLoadingScreen: loadingCallback,
				logQR: false,
			});
		} catch (e: any) {
			onError(e);
		}
		await this.client.start();
		activeWhatsappClients.push(this);
		this.setupMessageCallback();
		onSuccess();
		return Promise.resolve(this);
	}

	onMessage(): Promise<void> {
		return Promise.resolve();
	}

	async getStatus(): Promise<SocketState> {
		return await this.client.getConnectionState();
	}

	getChatId(contact: WhatsappContact): string {
		const { type, identifier } = contact;
		if (type === "individual") {
			return identifier.includes("@c.us")
				? identifier
				: `${contact.identifier}@c.us`;
		} else {
			return identifier.includes("@g.us")
				? identifier
				: `${contact.identifier}@g.us`;
		}
	}

	async getGroups(): Promise<Array<Chat>> {
		return await this.client.listChats({ onlyGroups: true });
	}

	getContact(identifier: string): WhatsappContact {
		if (identifier.includes("@c.us")) {
			return {
				type: ContactType.INDIVIDUAL,
				identifier: identifier.replace("@c.us", ""),
			};
		}
		return {
			type: ContactType.GROUP,
			identifier: identifier.replace("@g.us", ""),
		};
	}

	setupMessageCallback(): void {
		this.client.onMessage(async (message) => {
			const session = this.session;
			if (message.type !== "chat") {
				//Ignore the message
				return;
			}

			//TODO: Implement phone number whitelist

			const incomingMessage: IncomingMessage = {
				from: this.getContact(message.from),
				message: {
					type: message.type as MessageType.CHAT,
					text: message.body,
				},
			};
			logger.info(`Sending message to chatbot for session - ${session}`);
			try {
				const reply: OutgoingMessage = await Parse.Cloud.run(
					"onMessageReceive",
					{
						sessionId: session,
						message: incomingMessage,
					},
				);
				if (reply) {
					await this.sendMessage({
						message: reply.message,
						to: reply.to,
					});
				}
			} catch (e) {
				logger.error(
					`Error sending message to core system: ${e.message}`,
				);
			}
		});
	}

	async sendMessage(messagePayload: OutgoingMessage): Promise<Message[]> {
		const { to, message } = messagePayload;

		const type = message.type;
		const chatIds = to.map(this.getChatId);

		switch (type) {
			case "chat":
				return await mapSeries(
					chatIds,
					asyncify(async (to: string) =>
						this.client.sendText(to, message.text),
					),
				);
			case "image":
				return await mapSeries(
					chatIds,
					asyncify(async (to: string) =>
						this.client.sendImageFromBase64(
							to,
							message.image,
							"",
							message.text,
						),
					),
				);
			default:
				throw Error(`${type} messages are not supported yet.`);
		}
	}

	async start(): Promise<BaseClient<Whatsapp>> {
		await this.client.start();
		return this;
	}
}
