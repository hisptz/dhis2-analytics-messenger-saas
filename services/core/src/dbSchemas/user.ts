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
		options: {
			defaultValue: false,
		},
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
		find: { requiresAuthentication: true },
		count: { requiresAuthentication: true },
		get: { requiresAuthentication: true },
		update: {
			"requiresAuthentication": true,
			"role:admin": true,
		},
		create: { "*": true },
		delete: { requiresAuthentication: true },
		addField: {},
	},
};

export const roleSchema = {
	className: "_Role",
	classLevelPermissions: {
		find: {},
		count: {},
		get: {},
		update: {
			"requiresAuthentication": true,
			"role:admin": true,
		},
		create: {},
		delete: {},
		addField: {},
	},
};
