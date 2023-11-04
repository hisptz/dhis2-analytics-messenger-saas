import { Router } from "express";
import clientRoutes from "../clients/routes";
import messagingRoutes from "../messaging/routes";

const router = Router();
router.use("/clients", clientRoutes);

router.use("/messaging", messagingRoutes);

router.get("/", (req, res) => {
	res.json({
		routes: ["clients"],
	});
});

export default router;
