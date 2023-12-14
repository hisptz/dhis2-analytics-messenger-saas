import { z } from "zod";

export enum ContactType {
	INDIVIDUAL = "individual",
	GROUP = "group",
}

export enum MessageType {
	IMAGE = "image",
	CHAT = "chat",
	DOCUMENT = "document",
	AUDIO = "audio",
	VIDEO = "video",
}

export const ImageMessageSchema = z.object({
	type: z.literal(MessageType.IMAGE),
	image: z.string(),
	text: z.string().optional(),
});
export type ImageMessage = z.infer<typeof ImageMessageSchema>;
export const TextMessageSchema = z.object({
	type: z.literal(MessageType.CHAT),
	text: z.string(),
});
export type TextMessage = z.infer<typeof TextMessageSchema>;
export const FileMessageSchema = z.object({
	type: z.enum([MessageType.AUDIO, MessageType.VIDEO]),
	text: z.string().optional(),
	file: z.string(),
});
export type FileMessage = z.infer<typeof FileMessageSchema>;
export const DocumentMessageSchema = z.object({
	type: z.literal(MessageType.DOCUMENT),
	file: z.string(),
	text: z.string().optional(),
});
export type DocumentMessage = z.infer<typeof DocumentMessageSchema>;
export const MessageContentSchema = z.discriminatedUnion("type", [
	ImageMessageSchema,
	FileMessageSchema,
	TextMessageSchema,
	DocumentMessageSchema,
]);
export type MessageContent = z.infer<typeof MessageContentSchema>;
export const WhatsappContactSchema = z.object({
	type: z.nativeEnum(ContactType),
	identifier: z.string(),
});
export type WhatsappContact = z.infer<typeof WhatsappContactSchema>;
export const ToContactSchema = z.object({
	identifier: z.string(),
	type: z.nativeEnum(ContactType),
});
export type ToContact = z.infer<typeof ToContactSchema>;
export const IncomingMessageSchema = z.object({
	message: MessageContentSchema,
	from: WhatsappContactSchema,
	isForwarded: z.boolean().optional(),
});
export type IncomingMessage = z.infer<typeof IncomingMessageSchema>;
export const OutGoingMessageSchema = z.object({
	message: MessageContentSchema,
	to: z.array(ToContactSchema),
});
export type OutgoingMessage = z.infer<typeof OutGoingMessageSchema>;
