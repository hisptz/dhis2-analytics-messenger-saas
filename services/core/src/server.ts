import express from "express";
import { config } from "dotenv";
import { parseDashboard, parseServer } from "./services/parseServer";
import { initServices } from "./services/init";
import { startWhatsappServices } from "./services/whatsapp";

config();

const app = express();

app.use(`${process.env.AUTH_MOUNT_PATH}`, parseServer.app);
app.use(`/dashboard`, parseDashboard);

const port = process.env.PORT ?? 3001;

initServices(app).then(() => {
	app.listen(`${port}`, () => {
		startWhatsappServices();
		console.info(`Server running at http://localhost:${port}`);
	});
});
