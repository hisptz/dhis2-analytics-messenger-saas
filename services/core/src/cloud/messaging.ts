import { messagingClient } from "../client/messaging";
import { WhatsappMessage } from "schemas";
import { z } from "zod";
import {
	ANALYTICS_JOB_CLASSNAME,
	ANALYTICS_JOB_STATUS_CLASSNAME,
} from "../dbSchemas/push";
import { getVisualization } from "../utils/visualization";
import { mapSeries } from "async";

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

async function sendWhatsAppMessageFromSchedule({
	clientId,
	messagePayload,
}: {
	clientId: string;
	messagePayload: WhatsappMessage;
}) {
	try {
		const client = await new Parse.Query("WhatsappClient").get(clientId, {
			useMasterKey: true,
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
						text: message,
					},
					to: [
						{
							identifier: to,
							type: "individual",
						},
					],
				},
			});
		default:
			throw Error("Unsupported client type");
	}
});
Parse.Cloud.define("runAnalyticsPushJob", async (request) => {
	const { jobId, trigger } = request.params;
	const user = request.user;
	if (!user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You must be logged in",
		);
	}
	const jobConfig = await new Parse.Query(ANALYTICS_JOB_CLASSNAME).get(
		jobId,
		{ sessionToken: user.getSessionToken() },
	);

	if (!jobConfig) {
		throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "Job not found");
	}
	await jobConfig.fetchWithInclude(["dhis2Instance"], {
		sessionToken: user.getSessionToken(),
	});

	const jobStatus = new Parse.Object(ANALYTICS_JOB_STATUS_CLASSNAME);
	jobStatus.set("startTime", new Date());
	jobStatus.set("trigger", trigger);
	jobStatus.set("job", jobConfig);
	jobStatus.set("status", "INITIALIZED");
	await jobStatus.save(null, { sessionToken: user.getSessionToken() });

	const dhis2URL = jobConfig.get("dhis2Instance").get("url");
	const dhis2PAT = jobConfig.get("dhis2Instance").get("pat");

	const images = await mapSeries(
		jobConfig.get("visualizations"),
		async (visualization: { id: string }) => {
			return await getVisualization({
				dhis2URL,
				dhis2PAT,
				id: visualization.id,
			});
		},
	);

	const contacts = jobConfig.get("contacts");
	const description = jobConfig.get("description");
	const messages: WhatsappMessage[] = images.map((image) => {
		return {
			to: contacts,
			message: {
				type: "image",
				image: image,
				text: description,
			},
		} as WhatsappMessage;
	});

	const client = await new Parse.Query("WhatsappClient")
		.equalTo("dhis2Instance", jobConfig.get("dhis2Instance"))
		.first({
			sessionToken: user.getSessionToken(),
		});

	if (!client) {
		jobStatus.set("status", "FAILED");
		jobStatus.set("endTime", new Date());
		jobStatus.set("logs", "Whatsapp client not found for this instance");
		await jobStatus.save(null, { sessionToken: user.getSessionToken() });
		throw new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			"Whatsapp client not found for this instance",
		);
	}
	try {
		const responses = await mapSeries(
			messages,
			async (message: WhatsappMessage) =>
				sendWhatsAppMessage({
					messagePayload: message,
					user,
					clientId: client?.id,
				}),
		);
		jobStatus.set("status", "COMPLETED");
		jobStatus.set("endTime", new Date());
		jobStatus.set("logs", JSON.stringify(responses));
		await jobStatus.save(null, { sessionToken: user.getSessionToken() });
	} catch (e) {
		jobStatus.set("status", "FAILED");
		jobStatus.set("endTime", new Date());
		jobStatus.set("logs", JSON.stringify(e));
		await jobStatus.save(null, { sessionToken: user.getSessionToken() });
		throw e; // rethrow error so that it can be handled by the client.
	}
});
Parse.Cloud.define("runScheduledAnalyticsPushJob", async (request) => {
	const { jobId, trigger } = request.params;
	const jobConfig = await new Parse.Query(ANALYTICS_JOB_CLASSNAME).get(
		jobId,
		{ useMasterKey: true },
	);

	if (!jobConfig) {
		throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "Job not found");
	}
	await jobConfig.fetchWithInclude(["dhis2Instance"], {
		useMasterKey: true,
	});

	const jobStatus = new Parse.Object(ANALYTICS_JOB_STATUS_CLASSNAME);
	jobStatus.set("startTime", new Date());
	jobStatus.set("trigger", trigger);
	jobStatus.set("job", jobConfig);
	jobStatus.set("status", "INITIALIZED");
	await jobStatus.save(null, { useMasterKey: true });

	const dhis2URL = jobConfig.get("dhis2Instance").get("url");
	const dhis2PAT = jobConfig.get("dhis2Instance").get("pat");

	const images = await mapSeries(
		jobConfig.get("visualizations"),
		async (visualization: { id: string }) => {
			return await getVisualization({
				dhis2URL,
				dhis2PAT,
				id: visualization.id,
			});
		},
	);

	const contacts = jobConfig.get("contacts");
	const description = jobConfig.get("description");
	const messages: WhatsappMessage[] = images.map((image) => {
		return {
			to: contacts,
			message: {
				type: "image",
				image: image,
				text: description,
			},
		} as WhatsappMessage;
	});

	const client = await new Parse.Query("WhatsappClient")
		.equalTo("dhis2Instance", jobConfig.get("dhis2Instance"))
		.first({
			useMasterKey: true,
		});

	if (!client) {
		jobStatus.set("status", "FAILED");
		jobStatus.set("endTime", new Date());
		jobStatus.set("logs", "Whatsapp client not found for this instance");
		await jobStatus.save(null, { useMasterKey: true });
		throw new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			"Whatsapp client not found for this instance",
		);
	}
	try {
		const responses = await mapSeries(
			messages,
			async (message: WhatsappMessage) =>
				sendWhatsAppMessageFromSchedule({
					messagePayload: message,
					clientId: client?.id,
				}),
		);
		jobStatus.set("status", "COMPLETED");
		jobStatus.set("endTime", new Date());
		jobStatus.set("logs", JSON.stringify(responses));
		await jobStatus.save(null, { useMasterKey: true });
	} catch (e) {
		jobStatus.set("status", "FAILED");
		jobStatus.set("endTime", new Date());
		jobStatus.set("logs", JSON.stringify(e));
		await jobStatus.save(null, { useMasterKey: true });
		throw e; // rethrow error so that it can be handled by the client.
	}
});
