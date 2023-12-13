//Action
import { generateSchema } from "./base";
import { ParseField } from "../cloud/types";
import { DHIS2_INSTANCE_CLASSNAME } from "./dhis2Instance";
import { WHATSAPP_CLIENT_CLASSNAME } from "./whatsappClient";

export const ACTION_CLASSNAME = "Action";
export const FLOW_CLASSNAME = "Flow";
export const FLOW_STATE_CLASSNAME = "FlowState";
const actionFields: ParseField[] = [
	{
		name: "type",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "text",
		type: "String",
	},
	{
		name: "options",
		type: "Object",
	},
	{
		name: "dataKey",
		type: "String",
	},
	{
		name: "functionName",
		type: "String",
	},
	{
		name: "url",
		type: "String",
	},
	{
		name: "visualizationId",
		type: "String",
	},
	{
		name: "urlOptions",
		type: "Object",
	}, //this will contain a response type,a method, headers, etc
	{
		name: "messageFormat",
		type: "Object",
	},
	{
		name: "sortOrder",
		type: "Number",
	},
	{
		name: "routes",
		type: "Array",
	},
	{
		name: "nextState",
		type: "String",
	},
];
const actionSchema = generateSchema(ACTION_CLASSNAME, actionFields);
const flowFields: ParseField[] = [
	{
		name: "trigger",
		type: "String",
	},
	{
		name: "dhis2Instance",
		type: "Pointer",
		targetClass: DHIS2_INSTANCE_CLASSNAME,
	},
	{
		name: "clients",
		type: "Array",
	},
];
const flowSchema = generateSchema(FLOW_CLASSNAME, flowFields);

const flowStateFields: ParseField[] = [
	{
		name: "action",
		type: "Pointer",
		targetClass: ACTION_CLASSNAME,
	},
	{
		name: "uid",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "flow",
		type: "Pointer",
		targetClass: FLOW_CLASSNAME,
	},
	{
		name: "retries",
		type: "Number",
	},
];
const flowStateSchema = generateSchema(FLOW_STATE_CLASSNAME, flowStateFields);
export const SESSION_CLASSNAME = "Session";
export const ENTRY_CLASSNAME = "Entry";
const entryFields: ParseField[] = [
	{
		name: "sequence",
		type: "Number",
	},
	{
		name: "session",
		type: "Pointer",
		targetClass: SESSION_CLASSNAME,
	},
];
const entrySchema = generateSchema(ENTRY_CLASSNAME, entryFields);

const sessionFields: ParseField[] = [
	{
		name: "startTime",
		type: "Date",
	},
	{
		name: "client",
		type: "Pointer",
		targetClass: WHATSAPP_CLIENT_CLASSNAME,
	},
	{
		name: "contactIdentifier",
		type: "String",
	},
	{
		name: "state",
		type: "Pointer",
		targetClass: FLOW_STATE_CLASSNAME,
	},
	{
		name: "flow",
		type: "Pointer",
		targetClass: FLOW_CLASSNAME,
	},
	{
		name: "retries",
		type: "Number",
	},
	{
		name: "data",
		type: "Object",
		options: {
			defaultValue: {},
		},
	},
	{
		name: "status",
		type: "String",
	},
];
const sessionSchema = generateSchema(SESSION_CLASSNAME, sessionFields);

export const chatbotSchema = [
	actionSchema,
	flowSchema,
	flowStateSchema,
	sessionSchema,
	entrySchema,
];
