import { ParseField } from "../types";
import { ParseSchema } from "./base";

const fields: ParseField[] = [
	{
		name: "url",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "pat",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "user",
		type: "Pointer",
		targetClass: "_User",
		options: {
			required: true,
		},
	},
];

export const dhis2InstanceSchema = new ParseSchema("DHIS2Instance", fields);
