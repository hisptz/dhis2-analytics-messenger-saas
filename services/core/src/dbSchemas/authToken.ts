import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

const fields: ParseField[] = [
	{
		name: "dhis2Instance",
		targetClass: "DHIS2Instance",
		type: "Pointer",
		options: {
			required: true,
		},
	},
	{
		name: "token",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "expiresIn",
		type: "Object",
		options: {
			required: true,
		},
	},
];

export const AUTH_TOKEN_CLASSNAME = "AuthToken";
export const authTokenSchema = generateSchema(AUTH_TOKEN_CLASSNAME, fields, {
	protectedFields: { "*": [], "owner": [] },
});
