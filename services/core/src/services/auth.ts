import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthData {
	token: string;
}

const secretKey = process.env.AUTH_JWT_SECRET_KEY;
const appId = process.env.AUTH_APP_ID ?? "";

export class DHIS2AuthAdapter {
	policy: "default" = "default";

	async validateAuthData(authData: AuthData, options: any) {
		const { token } = authData;
		if (!token) {
			throw new Parse.Error(Parse.Error.INCORRECT_TYPE, "Missing token");
		}

		if (!secretKey) {
			throw new Parse.Error(
				Parse.Error.INTERNAL_SERVER_ERROR,
				"Missing secret key. Contact the server administrator",
			);
		}
		const data = jwt.verify(token, secretKey) as JwtPayload;
		return Promise.resolve();
	}

	validateSetUp() {
		return Promise.resolve({});
	}

	validateLogin() {
		return Promise.resolve({});
	}

	challenge() {
		return Promise.resolve({});
	}

	validateUpdate() {
		return Promise.resolve({});
	}

	afterFind() {
		return Promise.resolve({});
	}

	validateOptions() {
		/* */
	}

	async validateAppId(appIds: string[], authData: AuthData, options: any) {
		await this.validateAuthData(authData, options);
		if (!appIds.includes(appId)) {
			throw new Parse.Error(
				Parse.Error.VALIDATION_ERROR,
				"Invalid app id",
			);
		}

		return Promise.resolve();
	}
}
