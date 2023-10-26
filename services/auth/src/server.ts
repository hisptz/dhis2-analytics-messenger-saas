import express from "express";
import { ParseServer } from "parse-server";
import ParseDashboard from "parse-dashboard";
import { config } from "dotenv";
import { dhis2InstanceSchema } from "./schemas/dhis2Instance";
import { whatsappClientSchema } from "./schemas/whatsappClient";
import { authTokenSchema } from "./schemas/authToken";

config();

const app = express();

const parse = new ParseServer({
	databaseURI: process.env.PARSE_SERVER_DATABASE_URI,
	appId: process.env.PARSE_SERVER_APPLICATION_ID,
	masterKey: process.env.PARSE_SERVER_MASTER_KEY,
	serverURL: process.env.PARSE_SERVER_SERVER_URL,
	publicServerURL: process.env.PARSE_SERVER_PUBLIC_SERVER_URL,
	mountPath: process.env.PARSE_SERVER_MOUNT_PATH,
	cloud:
		process.env.NODE_ENV === "development"
			? "./build/cloud/main.js"
			: "./cloud/main.js",
	schema: {
		definitions: [
			dhis2InstanceSchema,
			whatsappClientSchema,
			authTokenSchema,
		],
		recreateModifiedFields: true,
		lockSchemas: true,
	},
});

const dashboard = new ParseDashboard({
	apps: [
		{
			serverURL: process.env.PARSE_SERVER_SERVER_URL,
			appId: process.env.PARSE_SERVER_APPLICATION_ID,
			masterKey: process.env.PARSE_SERVER_MASTER_KEY,
			appName: "DHIS2 Analytics Messenger SaaS Auth",
		},
	],
});

app.use(`${process.env.PARSE_SERVER_MOUNT_PATH}`, parse.app);
app.use(`/dashboard`, dashboard);

const port = process.env.PORT ?? 3001;

parse.start().then(() => {
	app.listen(`${port}`, () => {
		console.info(`Server running at http://localhost:${port}`);
	});
});
