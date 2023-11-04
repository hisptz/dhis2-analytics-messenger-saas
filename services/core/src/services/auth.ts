import { config } from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

config();

export interface AuthData {
	token: string;
	id: string;
}

export class DHIS2AuthAdapter {
	policy: "default" = "default";

	async validateSetUp(
		authData: AuthData,
		options: any,
		req: Parse.Cloud.TriggerRequest & { userFromJWT: Parse.User },
	) {
		const { token } = authData;
		if (!token) {
			throw new Parse.Error(
				Parse.Error.OBJECT_NOT_FOUND,
				"Missing token",
			);
		}
		try {
			const payload = jwt.verify(token, options.secretKey) as JwtPayload;
			if (payload.user && payload.instance) {
				//TODO: Add more validation
				return;
			}
		} catch (e) {
			throw new Parse.Error(
				Parse.Error.VALIDATION_ERROR,
				"Invalid token",
			);
		}
	}

	async validateLogin() {
		console.log("Login");
	}

	async validateUpdate() {
		console.log("Update");
	}

	async validateAppId() {
		return Promise.resolve({});
	}
}
