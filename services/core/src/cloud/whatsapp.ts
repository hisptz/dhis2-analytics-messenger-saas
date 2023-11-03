import { startWhatsappServices } from "../services/whatsapp";

Parse.Cloud.job("startWhatsappServers", async () => {
	await startWhatsappServices();
});
