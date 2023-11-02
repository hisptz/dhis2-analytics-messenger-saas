import { parseServer } from "./parseServer";
// import { initializeScheduling } from "./scheduling";
import { initOpenAPI } from "./openapi";
import { Express } from "express";
import logger from "./logging";

export async function initServices(app: Express) {
	await parseServer.start();
	// await initializeScheduling();
	logger.info(`All services started successfully`);
}
