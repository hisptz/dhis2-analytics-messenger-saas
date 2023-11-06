import { WhatsappClient } from "../whatsapp";

export async function startSession(session: string) {
	const existingClient = WhatsappClient.get(session);

	if (existingClient) {
		throw Error("Client is already active");
	}
	const whatsappClient = new WhatsappClient(session);
	await whatsappClient.init();
	return {
		status: "ok",
	};
}

export async function stopSession(session: string) {
	const existingClient = WhatsappClient.get(session);

	if (!existingClient) {
		return;
	}
	await existingClient.stop();
	return {
		status: "ok",
	};
}
