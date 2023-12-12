import sendGrid from "@sendgrid/mail";
import { config } from "dotenv";

config();

interface Payload {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export async function emailAPICallback({ payload }: { payload: Payload }) {
	const apiKey = process.env.SENDGRID_API_KEY;
	const fromAddress = process.env.SENDGRID_FROM_ADDRESS;
	sendGrid.setApiKey(apiKey);
	const sendgridPayload: sendGrid.MailDataRequired = {
		to: payload.to,
		from: {
			name: process.env.AUTH_APP_NAME,
			email: fromAddress,
		},
		text: payload.text,
		subject: payload.subject,
		html: payload.html,
	};
	return sendGrid.send(sendgridPayload);
}
