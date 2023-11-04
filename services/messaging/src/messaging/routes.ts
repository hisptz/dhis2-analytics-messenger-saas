import { Router } from "express";
import whatsappRouter from "./whatsapp/routes";

const router = Router();
router.use("/whatsapp", whatsappRouter);

export default router;
