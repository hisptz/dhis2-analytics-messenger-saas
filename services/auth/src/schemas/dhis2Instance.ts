import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

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

export const dhis2InstanceSchema = generateSchema("DHIS2Instance", fields, {
	protectedFields: {
		"*": ["pat"],
	},
});
