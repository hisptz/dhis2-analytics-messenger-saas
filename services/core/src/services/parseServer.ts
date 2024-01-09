import { ParseServer } from "parse-server";
import { dhis2InstanceSchema } from "../dbSchemas/dhis2Instance";
import { whatsappClientSchema } from "../dbSchemas/whatsappClient";
import { authTokenSchema } from "../dbSchemas/authToken";
import { analyticsJobSchema } from "../dbSchemas/push";
import ParseDashboard from "parse-dashboard";
import { config } from "dotenv";
import { roleSchema, userSchema } from "../dbSchemas/user";

import { DHIS2AuthAdapter } from "./auth";
import { emailAPICallback } from "./email";
import { chatbotSchema } from "../dbSchemas/chatbot";

config();

const templatesFolder = process.env.AUTH_PARSE_TEMPLATES ?? "./templates";
export const parseServer = new ParseServer({
	databaseURI: process.env.AUTH_DATABASE_URI,
	appId: process.env.AUTH_APPLICATION_ID,
	masterKey: process.env.AUTH_MASTER_KEY,
	serverURL: process.env.AUTH_SERVER_URL,
	publicServerURL: process.env.AUTH_PUBLIC_SERVER_URL,
	preventLoginWithUnverifiedEmail: true,
	revokeSessionOnPasswordReset: true,
	mountPath: process.env.AUTH_MOUNT_PATH,
	appName: process.env.AUTH_APP_NAME,
	auth: {
		dhis2Auth: {
			enabled: true,
			module: DHIS2AuthAdapter,
			secretKey: process.env.AUTH_JWT_SECRET_KEY,
		},
	},
	cloud: process.env.AUTH_CLOUD ?? "./services/core/app/src/cloud/main.js",
	schema: {
		definitions: [
			userSchema,
			roleSchema,
			dhis2InstanceSchema,
			whatsappClientSchema,
			authTokenSchema,
			...analyticsJobSchema,
			...chatbotSchema,
		],
		recreateModifiedFields: true,
	},
	verifyUserEmails: true,
	emailVerifyTokenValidityDuration: 2 * 60 * 60,
	emailAdapter: {
		module: "parse-server-api-mail-adapter",
		options: {
			sender: process.env.SENDGRID_FROM_ADDRESS,
			templates: {
				verificationEmail: {
					htmlPath: `${templatesFolder}/verification/verification_email.html`,
					textPath: `${templatesFolder}/verification/text.txt`,
					subjectPath: `${templatesFolder}/verification/subject.txt`,
				},
				userRegistrationNotification: {
					subjectPath: `${templatesFolder}/userRegistrationNotification/subject.txt`,
					textPath: `${templatesFolder}/userRegistrationNotification/text.txt`,
				},
			},
			apiCallback: emailAPICallback,
		},
	},
	customPages: {
		passwordResetSuccess: `${process.env.PANEL_BASE_URL}/passwordResetSuccess`,
		verifyEmailSuccess: `${process.env.PANEL_BASE_URL}/verifyEmailSuccess`,
		linkSendSuccess: `${process.env.PANEL_BASE_URL}/linkSendSuccess`,
		linkSendFail: `${process.env.PANEL_BASE_URL}/linkSendFail`,
		invalidLink: `${process.env.PANEL_BASE_URL}/invalidLink`,
		invalidVerificationLink: `${process.env.PANEL_BASE_URL}/invalidVerificationLink`,
		choosePassword: `${process.env.PANEL_BASE_URL}/choosePassword`,
	},
});
export const parseDashboard = new ParseDashboard({
	apps: [
		{
			serverURL: process.env.PARSE_DASHBOARD_SERVER_URL,
			appId: process.env.PARSE_DASHBOARD_APP_ID,
			masterKey: process.env.PARSE_DASHBOARD_MASTER_KEY,
			appName: "DHIS2 Analytics Messenger SaaS Auth",
		},
	],
});
