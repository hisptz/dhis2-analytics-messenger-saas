import { Express } from "express";
import { parseServer } from "./parseServer";

export async function initServices(app: Express) {
	await parseServer.start();
}
