import { WhatsappClient } from "../clients/whatsapp/whatsapp";

export let activeWhatsappClients: WhatsappClient[] = [];

export function removeClient(session: string) {
	activeWhatsappClients = activeWhatsappClients.filter(
		(client) => client.session !== session,
	);
}
