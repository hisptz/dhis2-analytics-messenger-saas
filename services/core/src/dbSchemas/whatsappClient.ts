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

export const WHATSAPP_CLIENT_CLASSNAME = "WhatsappClient";
export const whatsappClientSchema = generateSchema(
	WHATSAPP_CLIENT_CLASSNAME,
	fields,
);
