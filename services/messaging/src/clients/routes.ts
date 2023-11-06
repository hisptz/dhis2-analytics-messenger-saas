import { Router } from "express";
import whatsappRouter from "./whatsapp/routes";

const router = Router();

router.get("/", (req, res) => {
	res.json({
		clients: ["whatsapp"],
	});
});

router.use("/whatsapp", whatsappRouter);
export default router;
