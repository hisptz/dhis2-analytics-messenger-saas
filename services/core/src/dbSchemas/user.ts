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
];

export const userSchema = {
	className: "_User",
	fields: fromPairs(fields.map(({ name, ...rest }) => [name, rest])),
};
