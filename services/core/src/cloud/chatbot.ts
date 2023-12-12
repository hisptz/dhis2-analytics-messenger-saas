import { ACTION_CLASSNAME, FLOW_CLASSNAME } from "../dbSchemas/chatbot";
import { forEach } from "lodash";
import { WHATSAPP_CLIENT_CLASSNAME } from "../dbSchemas/whatsappClient";
import logger from "../services/logging";
import { DHIS2_INSTANCE_CLASSNAME } from "../dbSchemas/dhis2Instance";

const defaultFlow = {
	id: "dd4d9a61",
	trigger: "Hello DHIS2",
	initialState: "b12ffbf3",
	states: [
		{
			type: "API",
			url: "{{dhis2URL}}/api/dataStore/hisptz-analytics-groups?fields=id,name",
			urlOptions: {
				responseDataPath: "entries",
				method: "GET",
			},
			dataKey: "groups",
		},
		{
			type: "MENU",
			dataKey: "groupId",
			text: "Hello, welcome to DHIS2 analytics service. Kindly select the group of visualization you want to view",
			options: {
				dataKey: "groups",
				textKey: "name",
				idKey: "key",
			},
		},
		{
			type: "API",
			dataKey: "visualizations",
			url: "{{dhis2URL}}/api/dataStore/hisptz-analytics-groups/{groupId}",
			urlOptions: {
				responseDataPath: "visualizations",
				method: "GET",
			},
		},
		{
			type: "MENU",
			dataKey: "visualizationId",
			text: "Select the visualization you would like to see",
			options: {
				dataKey: "visualizations",
				textKey: "name",
				idKey: "id",
			},
		},
		{
			type: "API",
			url: "{{dhis2URL}}/api/visualizations/{visualizationId}?fields=id,description",
			dataKey: "description",
			urlOptions: {
				responseDataPath: "description",
				method: "GET",
			},
		},
		{
			type: "VISUALIZE",
			visualizationId: "{visualizationId}",
			dataKey: "visualizationImage",
		},
		{
			type: "QUIT",
			text: "Here is the visualization requested. Thank you for using DHIS2 Analytics Service!",
			messageFormat: {
				type: "image",
				image: "{visualizationImage}",
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
	const actions = defaultFlow.states.map((state, index) => {
		const action = new Parse.Object(ACTION_CLASSNAME);
		action.set("flow", flow);
		action.set("sortOrder", index + 1);
		forEach(Object.keys(state), (key) => {
			action.set(key, state[key]);
		});
		return action;
	});

	await Parse.Object.saveAll(actions, {
		sessionToken: request.user.getSessionToken(),
	});
});
