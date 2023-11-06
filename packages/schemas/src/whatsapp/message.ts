import { z } from "zod";

export const ImageMessageSchema = z.object({
	type: z.literal("image"),
	image: z.string(),
	text: z.string().optional(),
});

export const TextMessageSchema = z.object({
	type: z.literal("text"),
	text: z.string(),
});

export const DocumentMessageSchema = z.object({
	type: z.literal("document"),
	file: z.string(),
	text: z.string().optional(),
});

export const MessageContentSchema = z.discriminatedUnion("type", [
	ImageMessageSchema,
	TextMessageSchema,
	DocumentMessageSchema,
]);

export const WhatsappContactSchema = z.object({
	type: z.enum(["individual", "group"]),
	identifier: z.string(),
});

export type WhatsappContact = z.infer<typeof WhatsappContactSchema>;

export const WhatsappMessageSchema = z.object({
	to: z
		.array(WhatsappContactSchema)
		.min(1, "There should be at least one contact to send the message to."),
	message: MessageContentSchema,
});

export type WhatsappMessage = z.infer<typeof WhatsappMessageSchema>;
