import { Router } from "express";
import { WhatsappClient } from "../whatsapp";

const router = Router();

router.get("/", (req, res) => {
	res.json({
		error: "Specify an ID",
	});
});

router.get("/:session", (req, res) => {
	res.json({
		actions: [`init`],
	});
});

router.post("/:session/start", async (req, res) => {
	const { session } = req.params;
	if (!session) {
		res.status(400).json({ error: "Session is required" });
	}

	const existingClient = WhatsappClient.get(session);

	if (existingClient) {
		res.status(304).json({
			error: `The client with session ${session} is already active.`,
		});

		return;
	}
	try {
		const whatsappClient = new WhatsappClient(session);
		await whatsappClient.init();
		res.json({
			status: "ok",
		});
	} catch (e) {
		res.status(500).json(e);
	}
});
router.post("/:session/stop", async (req, res) => {
	const { session } = req.params;
	if (!session) {
		res.status(400).json({ error: "Session is required" });
	}

	const existingClient = WhatsappClient.get(session);

	if (!existingClient) {
		res.status(304).json({
			error: `The client with session ${session} is not active.`,
		});
		return;
	}

	try {
		await existingClient.stop();
		res.json({
			status: "ok",
		});
	} catch (e) {
		res.status(500).json(e);
	}
});

router.get("/:session/status", async (req, res) => {
	const { session } = req.params;
	if (!session) {
		res.status(400).json({ error: "Session is required" });
	}

	const whatsapp = WhatsappClient.get(session);

	if (!whatsapp) {
		res.json({
			status: "NOT_ACTIVE",
		});
		return;
	}
	try {
		const state = await whatsapp.getStatus();
		res.json({
			status: state,
		});
	} catch (e) {
		res.status(500).json(e);
	}
});

export default router;
