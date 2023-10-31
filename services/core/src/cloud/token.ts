/*
 *  - How to authenticate a user using a custom adapter
 *  - Figure out the
 *
 * */

import jwt from "jsonwebtoken";
import { head } from "lodash";
import { config } from "dotenv";

config();

Parse.Cloud.beforeSave("AuthToken", async (req) => {
	const { original, object, user } = req;

	if (!user) {
		throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found");
	}
	if (original) {
		throw Error(
			"Editing authentication tokens is currently not supported. Create a new one instead.",
		);
	}

	const expiresIn = object.get("expiresIn") as { key: string; value: number };

	const payload = {
		user: user?.id,
		dhis2Instance: object.get("dhis2Instance")?.id,
	};

	const secretKey = process.env.AUTH_JWT_SECRET_KEY;

	if (!secretKey) {
		throw Error(
			"The variable `PARSE_SERVER_JWT_SECRET_KEY` is not set in the environment. ",
		);
	}
	const token = jwt.sign(payload, secretKey, {
		expiresIn: `${expiresIn.value}${head(expiresIn.key.split(""))}`,
	});
	object.set("user", user);
	object.set("token", token);
});

Parse.Cloud.afterSave("AuthToken", async (req) => {
	const { user, object } = req;
	if (!user) {
		throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found");
	}
	await user.linkWith("dhis2Auth", {
		authData: {
			id: object.id,
			token: object.get("token"),
		},
	});
});
