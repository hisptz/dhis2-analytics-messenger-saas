import { ParseField } from "../types";
import { ParseSchema } from "./base";

const fields: ParseField[] = [
	{
		name: "user",
		targetClass: "_User",
		type: "Pointer",
		options: {
			required: true,
		},
	},
];

export const whatsappClientSchema = new ParseSchema("WhatsappClient", fields);
