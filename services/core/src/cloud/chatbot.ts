import {
	ACTION_CLASSNAME,
	FLOW_CLASSNAME,
	FLOW_STATE_CLASSNAME,
} from "../dbSchemas/chatbot";
import { forEach } from "lodash";
import { WHATSAPP_CLIENT_CLASSNAME } from "../dbSchemas/whatsappClient";
import logger from "../services/logging";
import { DHIS2_INSTANCE_CLASSNAME } from "../dbSchemas/dhis2Instance";
import {
	IncomingMessage,
	MessageType,
	OutGoingMessage,
} from "../apiSchemas/message";
import { ChatbotEngine } from "../services/chatbotEngine";

const defaultFlow = {
	id: "dd4d9a61",
	trigger: "Hello DHIS2",
	initialState: "b12ffbf3",
	states: [
		{
			uid: "b12ffbf3",
			action: {
				type: "API",
				url: "{dhis2URL}/api/dataStore/hisptz-analytics-groups?fields=id,name",
				urlOptions: {
					responseDataPath: "entries",
					method: "GET",
				},
				dataKey: "groups",
				nextState: "dc381521",
			},
		},
		{
			uid: "dc381521",
			action: {
				type: "MENU",
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
				type: "API",
				dataKey: "visualizations",
				url: "{dhis2URL}/api/dataStore/hisptz-analytics-groups/{groupId}",
				urlOptions: {
					responseDataPath: "visualizations",
					method: "GET",
				},
				nextState: "53f023bb",
			},
		},
		{
			uid: "53f023bb",
			action: {
				type: "MENU",
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
				type: "API",
				url: "{dhis2URL}/api/visualizations/{visualizationId}?fields=id,description",
				dataKey: "description",
				urlOptions: {
					responseDataPath: "description",
					method: "GET",
				},
				nextState: "d5d5914b",
			},
		},
		{
			uid: "d5d5914b",
			action: {
				type: "VISUALIZE",
				visualizationId: "{visualizationId}",
				dataKey: "visualizationImage",
				nextState: "a2a4b00a",
			},
		},
		{
			uid: "a2a4b00a",
			action: {
				type: "QUIT",
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
			action.set(key, state[key]);
		});

		flowState.set("action", action);
		return flowState;
	});

	await Parse.Object.saveAll(flowStates, {
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
			to: message.from,
			message: {
				type: MessageType.CHAT,
				text: e.message,
			},
		} as OutGoingMessage;
	}
});
