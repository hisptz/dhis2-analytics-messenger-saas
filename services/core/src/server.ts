import express from "express";
import { config } from "dotenv";
import { parseDashboard, parseServer } from "./services/parseServer";
import { initServices } from "./services/init";
import { startWhatsappServices } from "./services/whatsapp";
import { initializeSchedules } from "./services/scheduling";
import logger from "./services/logging";

config();

const app = express();

app.use(`${process.env.AUTH_MOUNT_PATH}`, parseServer.app);
app.use(`/dashboard`, parseDashboard);

const port = process.env.PORT ?? 3001;

initServices(app).then(() => {
	app.listen(`${port}`, async () => {
		await startWhatsappServices();
		await initializeSchedules();
		logger.info(`All services started successfully`);
		logger.info(`Server running at http://localhost:${port}`);
		logger.info(
			`Parse server running at http://localhost:${port}${process.env.AUTH_MOUNT_PATH}`,
		);
	});
});
