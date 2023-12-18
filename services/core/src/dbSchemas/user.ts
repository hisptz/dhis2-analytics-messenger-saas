import { ParseField } from "../cloud/types";
import { fromPairs } from "lodash";

const fields: ParseField[] = [
	{
		name: "fullName",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "phoneNumber",
		type: "String",
	},
	{
		name: "approved",
		type: "Boolean",
	},
	{
		name: "approvedBy",
		type: "Pointer",
		targetClass: "_User",
	},
];

export const userSchema = {
	className: "_User",
	fields: fromPairs(fields.map(({ name, ...rest }) => [name, rest])),
	classLevelPermissions: {
		find: { "*": true },
		count: { "*": true },
		get: { "*": true },
		update: { requiresAuthentication: true },
		create: { "*": true },
		delete: { requiresAuthentication: true },
		addField: {},
	},
};
