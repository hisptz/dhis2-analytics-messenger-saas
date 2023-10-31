import { z } from "zod";

export const ContactSchema = z.object({
	id: z.string(),
	type: z.enum(["group", "individual"]),
	identifier: z.string(),
	clientType: z.enum(["whatsapp", "telegram"]),
});

export type Contact = z.infer<typeof ContactSchema>;

export const VisualizationSchema = z.object({
	name: z.string(),
	id: z.string(),
});

export type Visualization = z.infer<typeof VisualizationSchema>;
export const PushRequestSchema = z.object({
	to: z.array(ContactSchema, {
		required_error: "Contacts to send push is required",
	}),
	visualizations: z.array(VisualizationSchema, {
		required_error: "A list of visualizations to send is required",
	}),
	description: z
		.string({ description: "A description of the visualizations" })
		.optional(),
});

export type PushRequest = z.infer<typeof PushRequestSchema>;
