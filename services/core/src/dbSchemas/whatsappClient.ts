import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

const fields: ParseField[] = [
	{
		name: "dhis2Instance",
		type: "Pointer",
		targetClass: "DHIS2Instance",
		options: {
			required: true,
		},
	},
	{
		name: "sessionId",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "enabled",
		type: "Boolean",
		options: {
			required: true,
			defaultValue: true,
		},
	},
	{
		name: "name",
		type: "String",
	},
];

export const WHATSAPP_CLIENT_CLASSNAME = "WhatsappClient";
export const whatsappClientSchema = generateSchema(
	WHATSAPP_CLIENT_CLASSNAME,
	fields,
);
