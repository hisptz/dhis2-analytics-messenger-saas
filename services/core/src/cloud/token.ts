/*
 *  - How to authenticate a user using a custom adapter
 *  - Figure out the
 *
 * */

import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

Parse.Cloud.afterSave("DHIS2Instance", async (request) => {
	const { original, object, user } = request;

	if (!user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You need to be authenticated",
		);
	}

	if (original) {
		return;
	}

	const authToken = new Parse.Object("AuthToken");
	authToken.setACL(new Parse.ACL(user));
	await authToken.save(
		{
			dhis2Instance: object,
			expiresIn: {
				value: 1,
				unit: "year",
			},
		},
		{
			sessionToken: user.getSessionToken(),
		},
	);
});

Parse.Cloud.beforeSave("AuthToken", async (req) => {
	const { original, object, user } = req;

	if (!user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You need to be authenticated",
		);
	}
	if (original) {
		throw Error(
			"Editing authentication tokens is currently not supported. Create a new one instead.",
		);
	}

	const payload = {
		user: user?.id,
		instance: object.get("dhis2Instance"),
	};
	const secretKey = process.env.AUTH_JWT_SECRET_KEY;
	if (!secretKey) {
		throw Error(
			"The variable `PARSE_SERVER_JWT_SECRET_KEY` is not set in the environment. ",
		);
	}
	const token = jwt.sign(payload, secretKey, {
		expiresIn: `1y`,
	});
	object.set("token", token);
});
Parse.Cloud.afterSave("AuthToken", async (req) => {
	const { user, object } = req;
	if (!user) {
		throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found");
	}
	await user.linkWith("dhis2Auth", {
		authData: {
			id: user.id,
		},
	});
});
