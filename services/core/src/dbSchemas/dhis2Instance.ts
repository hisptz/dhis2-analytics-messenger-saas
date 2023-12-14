import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

const fields: ParseField[] = [
	{
		name: "name",
		type: "String",
		options: {
			required: true,
		},
	},
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
export const DHIS2_INSTANCE_CLASSNAME = "DHIS2Instance";

export const dhis2InstanceSchema = generateSchema(
	DHIS2_INSTANCE_CLASSNAME,
	fields,
	{
		protectedFields: {
			"*": [],
			"owner": [],
		},
	},
);
