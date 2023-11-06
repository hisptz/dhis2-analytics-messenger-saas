import { Router } from "express";
import { WhatsappClient } from "../whatsapp";
import { startSession, stopSession } from "../controllers/session";
import { asyncify, map } from "async";

const router = Router();

router.get("/", (req, res) => {
	res.json({
		error: "Specify an ID",
	});
});
router.post("/start", async (req, res) => {
	const { sessions } = req.body;
	if (!sessions || !Array.isArray(sessions)) {
		res.status(400).json({
			error: "Specify a list of sessions to start",
		});
		return;
	}

	try {
		const responses = await map<string, { status: string }>(
			sessions,
			asyncify(async (session: string) =>
				startSession(session).then((state) => ({ session: state })),
			),
		);
		res.json(responses);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});
router.post("/stop", async (req, res) => {
	const { sessions } = req.body;
	if (!sessions || !Array.isArray(sessions)) {
		res.status(400).json({
			error: "Specify a list of sessions to stop",
		});
		return;
	}

	try {
		const responses = await map<string, { status: string }>(
			sessions,
			asyncify(async (session: string) =>
				stopSession(session).then((state) => ({ [session]: state })),
			),
		);
		res.json(responses);
	} catch (e) {
		res.status(500).json({ error: e });
	}
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
	try {
		const state = await startSession(session);
		res.json(state);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});
router.post("/:session/stop", async (req, res) => {
	const { session } = req.params;
	if (!session) {
		res.status(400).json({ error: "Session is required" });
	}

	try {
		const state = await stopSession(session);
		res.json(state);
	} catch (e) {
		res.status(500).json({ error: e });
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
		res.status(500).json({ error: e });
	}
});
router.get("/:session/groups", async (req, res) => {
	const { session } = req.params;
	if (!session) {
		res.status(400).json({ error: "Session is required" });
	}
	const whatsapp = WhatsappClient.get(session);

	if (!whatsapp) {
		res.status(500).json({
			error: "Client is not active. Make sure to call start first",
		});
		return;
	}

	try {
		const groups = await whatsapp.getGroups();
		res.json(
			groups.map((group) => {
				return {
					id: group.id._serialized,
					name: group.name ?? (group.groupMetadata as any)?.subject,
				};
			}),
		);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

export default router;
