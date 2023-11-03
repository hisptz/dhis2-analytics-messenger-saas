import { Router } from "express";
import sessionRouter from "./session";

const router = Router();

router.get("/", (req, res) => {
	res.json({
		supportedRoutes: ["session"],
	});
});

router.use("/session", sessionRouter);

export default router;
