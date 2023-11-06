import { ParseServer } from "parse-server";
import { dhis2InstanceSchema } from "../dbSchemas/dhis2Instance";
import { whatsappClientSchema } from "../dbSchemas/whatsappClient";
import { authTokenSchema } from "../dbSchemas/authToken";
import { analyticsJobSchema } from "../dbSchemas/push";
import ParseDashboard from "parse-dashboard";
import { config } from "dotenv";
import { userSchema } from "../dbSchemas/user";

import { DHIS2AuthAdapter } from "./auth";

config();

export const parseServer = new ParseServer({
	databaseURI: process.env.AUTH_DATABASE_URI,
	appId: process.env.AUTH_APPLICATION_ID,
	masterKey: process.env.AUTH_MASTER_KEY,
	serverURL: process.env.AUTH_SERVER_URL,
	publicServerURL: process.env.AUTH_PUBLIC_SERVER_URL,
	mountPath: process.env.AUTH_MOUNT_PATH,
	auth: {
		dhis2Auth: {
			enabled: true,
			module: DHIS2AuthAdapter,
			secretKey: process.env.AUTH_JWT_SECRET_KEY,
		},
	},
	cloud:
		process.env.NODE_ENV === "development"
			? "./build/src/cloud/main.js"
			: "./cloud/main.js",
	schema: {
		definitions: [
			userSchema,
			dhis2InstanceSchema,
			whatsappClientSchema,
			authTokenSchema,
			...analyticsJobSchema,
		],
		recreateModifiedFields: true,
	},
});

export const parseDashboard = new ParseDashboard({
	apps: [
		{
			serverURL: process.env.AUTH_SERVER_URL,
			appId: process.env.AUTH_APPLICATION_ID,
			masterKey: process.env.AUTH_MASTER_KEY,
			appName: "DHIS2 Analytics Messenger SaaS Auth",
		},
	],
});
