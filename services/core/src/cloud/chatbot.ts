import {
	ACTION_CLASSNAME,
	FLOW_CLASSNAME,
	FLOW_STATE_CLASSNAME,
} from "../dbSchemas/chatbot";
import { forEach } from "lodash";
import { WHATSAPP_CLIENT_CLASSNAME } from "../dbSchemas/whatsappClient";
import logger from "../services/logging";
import { DHIS2_INSTANCE_CLASSNAME } from "../dbSchemas/dhis2Instance";
import { IncomingMessage, MessageType, OutgoingMessage } from "schemas";
import { ChatbotEngine } from "../services/chatbotEngine";
import { ActionType, FlowData } from "../apiSchemas/flow";

const defaultFlow: FlowData = {
	id: "dd4d9a61",
	trigger: "Hello DHIS2",
	initialState: "b12ffbf3",
	states: [
		{
			uid: "b12ffbf3",
			action: {
				type: ActionType.DHIS2API,
				urlOptions: {
					resource: "dataStore/hisptz-analytics-groups",
					params: {
						fields: ["id", "name"],
					},
					responseDataPath: "entries",
				},
				dataKey: "groups",
				nextState: "dc381521",
			},
		},
		{
			uid: "dc381521",
			action: {
				type: ActionType.MENU,
				dataKey: "groupId",
				text: "Hello, welcome to DHIS2 analytics service. Kindly select the group of visualization you want to view",
				options: {
					dataKey: "groups",
					textKey: "name",
					idKey: "key",
				},
				nextState: "7f6902aa",
			},
		},
		{
			uid: "7f6902aa",
			action: {
				type: ActionType.DHIS2API,
				dataKey: "visualizations",
				urlOptions: {
					resource: "dataStore/hisptz-analytics-groups/{groupId}",
					responseDataPath: "visualizations",
				},
				nextState: "53f023bb",
			},
		},
		{
			uid: "53f023bb",
			action: {
				type: ActionType.MENU,
				dataKey: "visualizationId",
				text: "Select the visualization you would like to see",
				options: {
					dataKey: "visualizations",
					textKey: "name",
					idKey: "id",
				},
				nextState: "4788a9d6",
			},
		},
		{
			uid: "4788a9d6",
			action: {
				type: ActionType.DHIS2API,
				urlOptions: {
					resource: "visualizations/{visualizationId}",
					params: {
						fields: ["id", "description"],
					},
				},
				dataKey: "description",
				nextState: "d5d5914b",
			},
		},
		{
			uid: "d5d5914b",
			action: {
				type: ActionType.VISUALIZER,
				visualizationId: "{visualizationId}",
				dataKey: "visualizationImage",
				nextState: "a2a4b00a",
			},
		},
		{
			uid: "a2a4b00a",
			action: {
				type: ActionType.QUIT,
				text: "Here is the visualization requested. Thank you for using DHIS2 Analytics Service!",
				messageFormat: {
					type: "image",
					image: "{visualizationImage}",
				},
			},
		},
	],
};
Parse.Cloud.define("seedDefaultChatbotFlow", async (request) => {
	const { instanceId } = request.params;
	logger.info(`Seeding default chat bot flow for instance ${instanceId}`);
	if (!instanceId) {
		throw new Error("Instance ID is required");
	}
	const instance = await new Parse.Query(DHIS2_INSTANCE_CLASSNAME).get(
		instanceId,
		{
			sessionToken: request.user.getSessionToken(),
		},
	);

	if (!instance) {
		throw new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			"DHIS2 Instance not found",
		);
	}

	const flowExists = await new Parse.Query(FLOW_CLASSNAME)
		.equalTo("dhis2Instance", instance)
		.equalTo("trigger", defaultFlow.trigger)
		.first({
			sessionToken: request.user.getSessionToken(),
		});

	if (flowExists) {
		logger.info(
			`Skipping seeding default chatbot flow. Flow already exists`,
		);
		return;
	}

	const clientQuery = new Parse.Query(WHATSAPP_CLIENT_CLASSNAME);
	clientQuery.equalTo("dhis2Instance", instance);
	const clients = await clientQuery.find({
		sessionToken: request.user.getSessionToken(),
	});

	const flow = new Parse.Object(FLOW_CLASSNAME);
	flow.set("dhis2Instance", instance);
	flow.set("trigger", defaultFlow.trigger);
	flow.set("clients", clients);
	await flow.save(null, {
		sessionToken: request.user.getSessionToken(),
	});
	await flow.fetch({
		sessionToken: request.user.getSessionToken(),
	});
	const flowStates = defaultFlow.states.map((state, index) => {
		const flowState = new Parse.Object(FLOW_STATE_CLASSNAME);
		flowState.set("flow", flow);
		flowState.set("uid", state.uid);
		const action = new Parse.Object(ACTION_CLASSNAME);
		forEach(Object.keys(state.action), (key) => {
			action.set(key, state.action[key]);
		});

		flowState.set("action", action);
		return flowState;
	});
	await Parse.Object.saveAll(flowStates, {
		sessionToken: request.user.getSessionToken(),
	});

	const initialState = await new Parse.Query(FLOW_STATE_CLASSNAME)
		.equalTo("uid", defaultFlow.initialState)
		.first({
			sessionToken: request.user.getSessionToken(),
		});

	flow.set("initialState", initialState);
	await flow.save(null, {
		sessionToken: request.user.getSessionToken(),
	});
});
Parse.Cloud.define("onMessageReceive", async (request) => {
	const { message, sessionId } = request.params as {
		message: IncomingMessage;
		sessionId: string;
	};
	if (!sessionId) {
		throw new Error("Session ID is required");
	}
	if (!message) {
		throw new Error("Message is required");
	}
	const clientQuery = new Parse.Query(WHATSAPP_CLIENT_CLASSNAME);
	clientQuery.equalTo("sessionId", sessionId);
	clientQuery.include(["dhis2Instance"]);
	const client = await clientQuery.first({ useMasterKey: true });

	if (!client) {
		throw new Error("Client not found");
	}

	try {
		const chatBotEngine = await ChatbotEngine.init({ message, client });
		return await chatBotEngine.runAction();
	} catch (e) {
		//Errors will be formatted messages
		return {
			to: [message.from],
			message: {
				type: MessageType.CHAT,
				text: e.message,
			},
		} as OutgoingMessage;
	}
});
