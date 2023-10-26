import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

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

export const whatsappClientSchema = generateSchema("WhatsappClient", fields);
