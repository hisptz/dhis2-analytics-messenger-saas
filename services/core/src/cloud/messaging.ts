import { messagingClient } from "../client/messaging";
import { WhatsappMessage } from "schemas";
import { z } from "zod";

async function sendWhatsAppMessage({
	user,
	clientId,
	messagePayload,
}: {
	clientId: string;
	user: Parse.User;
	messagePayload: WhatsappMessage;
}) {
	try {
		const client = await new Parse.Query("WhatsappClient").get(clientId, {
			sessionToken: user.getSessionToken(),
		});
		const response = await messagingClient.post(
			`messaging/whatsapp/${client.get("sessionId")}/send`,
			messagePayload,
		);

		return response.data;
	} catch (e) {
		console.log(e);
		throw Error(`Client with ID ${clientId} could not be found. `);
	}
}

const message = z.object({
	to: z.string(),
	message: z.string(),
	clientType: z.literal("whatsapp"),
	clientId: z.string(),
});

type Message = z.infer<typeof message>;

Parse.Cloud.define("sendTestWhatsappMessage", async (request) => {
	const { message, clientType, clientId, to } = request.params as Message;

	if (!request.user) {
		throw "Permission denied";
	}

	if (!clientType || !clientId) {
		throw Error("Client type and client ID are required");
	}

	switch (clientType) {
		case "whatsapp":
			return await sendWhatsAppMessage({
				user: request.user,
				clientId,
				messagePayload: {
					message: {
						type: "text",
						text: messag,
					},
					to: [
						{
							identifier: to,
							type: "individual,
						,
					,
				,
			});
		default:
			throw Error("Unsupported client type");
	}
});
