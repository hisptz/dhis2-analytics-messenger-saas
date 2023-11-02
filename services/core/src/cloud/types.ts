import { z } from "zod";

export type ParseField = {
	name: string;
	type: Parse.Schema.TYPE;
	options?: Parse.Schema.FieldOptions;
	targetClass?: string;
};

export const sessionTokenSchema = z.object({
	user: z.string(),
	dhis2Instance: z.string(),
	session: z.string(),
	expiresIn: z.string(),
});

export type SessionToken = z.infer<typeof sessionTokenSchema>;
