import { Router } from "express";
import { getDHIS2Config } from "../utils/dhis2Instance";

const router: Router = Router();

router.get("/", async (req, res) => {
	const token = req.headers.token;
	if (!token) {
		res.send(400).json({ error: "Missing token" });
	}
	const dhis2Instance = await getDHIS2Config(token as string);

	res.json(dhis2Instance);
});

export default router;
