import { config as configEnv } from "dotenv";

import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
import { sanitizeEnv } from "./utils/env";
import cors from "cors";
import { createServer } from "http";
import { initWebsocket, registerWebhooks } from "./services/websocket";
import morgan from "morgan";

configEnv();
sanitizeEnv();

const app = express();
app.set("trust proxy", true);
const server = createServer(app);

initWebsocket(server);

app.use(cors());
app.use(morgan("tiny"));

const apiKey = process.env.API_KEY;

// if (apiKey) {
// 	app.use(apiKeyAuth(/^API_KEY/));
// }

app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
	}),
);

const limiter = RateLimit({
	windowMs: 10 * 1000,
	max: 100,
	handler: (req, res) => {
		res.status(429).json({
			error: "Too many requests, please try again later.",
		});
	},
});
app.use(limiter);
app.use(bodyParser.json({ limit: "50mb" }));
const port = process.env.PORT ?? 3002;

app.use(`${process.env.MESSAGING_MOUNT_PATH ?? ""}`, routes);

registerWebhooks();
server.listen(port, () => {
	console.info(`Messaging client started at port ${port}s`);
});
