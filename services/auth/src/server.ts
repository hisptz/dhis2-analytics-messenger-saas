import express from "express";
import { ParseServer } from "parse-server";
import ParseDashboard from "parse-dashboard";
import { config } from "dotenv";
import { dhis2InstanceSchema } from "./schemas/dhis2Instance";
import { whatsappClientSchema } from "./schemas/whatsappClient";
import { authTokenSchema } from "./schemas/authToken";
import dhis2Router from "./routes/dhis2";

config();

const app = express();

const parse = new ParseServer({
	databaseURI: process.env.AUTH_DATABASE_URI,
	appId: process.env.AUTH_APPLICATION_ID,
	masterKey: process.env.AUTH_MASTER_KEY,
	serverURL: process.env.AUTH_SERVER_URL,
	publicServerURL: process.env.AUTH_PUBLIC_SERVER_URL,
	mountPath: process.env.AUTH_MOUNT_PATH,
	cloud:
		process.env.NODE_ENV === "development"
			? "./build/src/cloud/main.js"
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
			serverURL: process.env.AUTH_SERVER_URL,
			appId: process.env.AUTH_APPLICATION_ID,
			masterKey: process.env.AUTH_MASTER_KEY,
			appName: "DHIS2 Analytics Messenger SaaS Auth",
		},
	],
});

app.use(`${process.env.AUTH_MOUNT_PATH}`, parse.app);

app.use(`/auth/dhis2`, dhis2Router);
app.use(`/dashboard`, dashboard);

const port = process.env.PORT ?? 3001;

parse.start().then(() => {
	app.listen(`${port}`, () => {
		console.info(`Server running at http://localhost:${port}`);
	});
});
