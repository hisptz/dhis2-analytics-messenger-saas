import { startWhatsappServices } from "../services/whatsapp";
import { messagingClient } from "../client/messaging";

Parse.Cloud.job("startWhatsappServers", async () => {
	await startWhatsappServices();
});

Parse.Cloud.define("getGroups", async (req) => {
	const { user } = req;
	if (!user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You must be logged in",
		);
	}
	const { instanceId } = req.params;
	const instance = await new Parse.Query("DHIS2Instance").get(instanceId, {
		sessionToken: req.user?.getSessionToken(),
	});
	const whatsappSession = await new Parse.Query("WhatsappClient")
		.equalTo("dhis2Instance", instance)
		.first({ sessionToken: req.user?.getSessionToken() });

	if (!whatsappSession) {
		throw new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			"Whatsapp client not found for this instance",
		);
	}

	const url = `/clients/whatsapp/session/${whatsappSession.get(
		"sessionId",
	)}/groups`;
	const response = await messagingClient.get(url);

	if (response.status === 200) {
		return response.data;
	}
});
