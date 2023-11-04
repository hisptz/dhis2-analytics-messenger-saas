import { messagingClient } from "../client/messaging";
import { WhatsappMessage } from "schemas";

async function sendWhatsAppMessage({
	clientId,
	messagePayload,
}: {
	clientId: string;
	messagePayload: WhatsappMessage;
}) {
	try {
		const client = await new Parse.Query("WhatsappClient").get(clientId);
		const response = await messagingClient.post(
			`messages/whatsapp/${client.get("sessionId")}/send`,
			messagePayload,
		);

		return response.data;
	} catch (e) {
		throw Error(`Client with ID ${clientId} could not be found. `);
	}
}

Parse.Cloud.define("sendTestMessage", async (request) => {
	const { message, clientType, clientId, phoneNumber } = request.params;

	if (!clientType || !clientId) {
		throw Error("Client type and client ID are required");
	}

	switch (clientType) {
		case "whatsapp":
			break;
		default:
			throw Error("Unsupported client type");
	}
});
