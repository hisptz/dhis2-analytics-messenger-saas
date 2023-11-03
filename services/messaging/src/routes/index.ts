import { Router } from "express";
import clientRoutes from "../clients/routes";

const router = Router();
router.use("/clients", clientRoutes);

router.get("/", (req, res) => {
	res.json({
		routes: ["clients"],
	});
});

export default router;
