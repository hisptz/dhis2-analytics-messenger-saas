/*
 *  - How to authenticate a user using a custom adapter
 *  - Figure out the
 *
 * */

import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { last } from "lodash";
import { DHIS2_INSTANCE_CLASSNAME } from "../dbSchemas/dhis2Instance";
import { AUTH_TOKEN_CLASSNAME } from "../dbSchemas/authToken";

config();
Parse.Cloud.afterSave(DHIS2_INSTANCE_CLASSNAME, async (request) => {
	const { original, object, user } = request;

	if (!user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You need to be authenticated",
		);
	}

	await Parse.Cloud.run(
		"seedDefaultChatbotFlow",
		{
			instanceId: object.id,
		},
		{ sessionToken: user.getSessionToken() },
	);

	if (original) {
		return;
	}

	const authToken = new Parse.Object(AUTH_TOKEN_CLASSNAME);
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

	await Parse.Cloud.run("seedDefaultChatbotFlow", {
		instanceId: object.id,
	});
});
Parse.Cloud.beforeSave(AUTH_TOKEN_CLASSNAME, async (req) => {
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
	object.set("token", `${user.id}/${token}`);
});
Parse.Cloud.afterSave(AUTH_TOKEN_CLASSNAME, async (req) => {
	const { user, object } = req;

	if (!user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You need to be authenticated",
		);
	}

	if (user._isLinked("dhis2Auth")) {
		return;
	}

	const authData = {
		id: user.id,
		token: last(object.get("token").split("/")),
	};

	await user.linkWith("dhis2Auth", {
		authData,
	});

	if (!user) {
		throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found");
	}
});
