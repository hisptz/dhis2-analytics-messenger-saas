import { Router } from "express";
import { OutgoingMessage, OutGoingMessageSchema } from "schemas";
import { SafeParseError } from "zod";
import { WhatsappClient } from "../../clients/whatsapp/whatsapp";

const router = Router();

router.get("/", (req, res) => {
	res.status(400).json({
		error: "You must specify a session ID",
	});
});
router.get("/:session", async (req, res) => {
	res.json({
		availableServices: ["send"],
	});
});
router.post("/:session/send", async (req, res) => {
	const { session } = req.params;
	const data = req.body;
	const validatedData = OutGoingMessageSchema.safeParse(data);
	if (!validatedData.success) {
		const error = (validatedData as SafeParseError<OutgoingMessage>).error;
		res.status(400).json({ error });
		return;
	}
	const client = WhatsappClient.get(session);
	if (!client) {
		res.status(500).json({
			error: `Requested whatsapp client ${session} is not active. Make sure it is connected before trying again`,
		});
		return;
	}

	try {
		const response = await client.sendMessage(validatedData.data);
		res.json(response);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

export default router;
