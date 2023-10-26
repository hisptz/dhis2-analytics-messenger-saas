/*
 * Let's figure out why each service requires access to the user and instance details
 *
 * Engine
 *  - To generate a visualization
 *  - References to the chat-bot flow
 *
 * Mediator
 *  - To connect to the specific instance and provide a gateway (Should we bypass this? It seems like it may be redundant since we can use PAT to directly access the DHIS2 instance)
 *
 * Messaging
 *  - Figure out configuration for the client
 *
 * Plan for approaching this implementation:
 *
 *  1. Collect the following info about the token:
 * 			 - id
 * 			 - expire time
 * 			 - instanceId - ID of the DHIS2 instance that will be using
 * 	2. Create a AuthToken object with those fields. - Should this be saved?
 *  3. Generate a jwt token from those fields
 *  4. Share to the user
 *  5. Save the AuthToken
 *
 *
 *  How do services use this token:
 *
 * 	Whenever a service has a request, the generated token should be in the headers (header can be `token` for now. )
 *   - The service then gets the AuthToken from the token by verifying the token
 *   - The service then uses the session token from the payload to become the user requesting the service (https://parseplatform.org/Parse-SDK-JS/api/4.0.1/Parse.User.html#.become)
 *   - From here on the service can request any of the data/services it requires from the auth system
 *   - If a service requires a service from any of the other service, it should request while passing down the token.
 *
 *  Notes:
 *   - Handle token error issues as early as possible. Preferably in the proxy service. A token should only be passed down if it is correct
 *   -

 * */
import jwt from "jsonwebtoken";
import { head } from "lodash";

Parse.Cloud.beforeSave("AuthToken", async (req) => {
	const { original, object, user } = req;
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

	const secretKey = process.env.PARSE_SERVER_JWT_SECRET_KEY;

	if (!secretKey) {
		throw Error(
			"The variable `PARSE_SERVER_JWT_SECRET_KEY` is not set in the environment. ",
		);
	}

	const token = jwt.sign(payload, secretKey, {
		expiresIn: `${expiresIn.value}${head(expiresIn.key.split(""))}`,
	});

	object.set("token", token);
});
