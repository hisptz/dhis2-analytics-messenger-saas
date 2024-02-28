import Parse from "parse/node";
import logger from "./logging";
import axios from "axios";
import { isEmpty } from "lodash";

Parse.initialize(
	process.env.AUTH_APP_ID ?? "DAM-AUTH",
	"",
	process.env.AUTH_MASTER_KEY ?? "MasterKey",
);
Parse.serverURL = process.env.AUTH_SERVER_URL ?? "http://localhost:3000/api";

const whatsappClient = axios.create({
	baseURL: `${process.env.MESSAGING_SERVER_URL}`,
});

export async function startWhatsappServices() {
	try {
		logger.info(`Starting up all enabled whatsapp clients...`);
		const query = new Parse.Query("WhatsappClient");
		query.equalTo("enabled", true);
		const clients = await query.find({ useMasterKey: true });

		if (isEmpty(clients)) {
			logger.info(`There are no enabled whatsapp clients. Skipping.`);
			return;
		}

		if (clients.length >= 100) {
			logger.warn(
				`There are ${clients.length} whatsapp clients. only first 100 have been started. Probably a good time to scale me up 😄`,
			);
		}
		const response = await whatsappClient.post(
			`clients/whatsapp/session/start`,
			{
				sessions: clients.map((client) => client.get("sessionId")),
			},
		);

		if (response.status === 200) {
			logger.info(`Whatsapp clients started successfully.`);
		} else {
			console.log(response.data);
			console.log(response);
			logger.error(`Could not start Whatsapp clients`);
		}
	} catch (e) {
		logger.error(`Could not start Whatsapp clients`);
		logger.error(e);
	}
}
