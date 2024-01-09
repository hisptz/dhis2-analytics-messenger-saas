import { config } from "dotenv";

config();
Parse.Cloud.beforeSave(Parse.User, async (request) => {
	const { object, original } = request;
	if (original) {
		return;
	}
	const newACL = new Parse.ACL();
	newACL.setRoleReadAccess("admin", true);
	newACL.setRoleWriteAccess("admin", true);
	object.setACL(newACL);
});

Parse.Cloud.afterSave(Parse.User, async (request) => {
	const { object: user, original } = request;

	if (original) {
		return;
	}

	//Send email to admin about a new registered user

	const placeholders = {
		fullName: user.get("fullName"),
		email: user.getEmail(),
		username: user.getUsername(),
		emailVerified: user.get("emailVerified") ? "Yes" : "No",
		phoneNumber: user.get("phoneNumber"),
	};

	const payload = {
		placeholders,
		recipient: process.env.AUTH_ADMIN_EMAIL,
		templateName: "userRegistrationNotification",
	};

	// @ts-ignore
	Parse.Cloud.sendEmail(payload);
});
