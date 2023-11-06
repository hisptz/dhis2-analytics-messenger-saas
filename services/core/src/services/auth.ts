import { config } from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

config();

export interface AuthData {
	token: string;
	id: string;
}

export interface ParseAuthResponse {
	doNotSave?: boolean;
	response?: Object;
	save?: Object;
}

export interface DHISAuthAdapterOptions {
	secretKey: string;
}

export class DHIS2AuthAdapter {
	policy: "default" = "default";

	constructor() {
		if (!this.policy) {
			this.policy = "default";
		}
	}

	validateAppId() {
		return Promise.resolve({});
	}

	async afterFind(authData: AuthData, options: DHISAuthAdapterOptions) {
		console.log(authData);
	}

	async validateAuthData(
		authData: AuthData,
		options: DHISAuthAdapterOptions,
	): Promise<ParseAuthResponse> {
		const { token, id: userId } = authData;
		if (!token) {
			throw new Parse.Error(
				Parse.Error.OBJECT_NOT_FOUND,
				"Missing token",
			);
		}
		try {
			const payload = jwt.verify(
				token,
				options.secretKey,
			) as JwtPayload & {
				user: string;
				instance: { objectId: string };
			};
			const { user, instance } = payload;

			if (!user || !instance) {
				throw new Parse.Error(
					Parse.Error.VALIDATION_ERROR,
					"Invalid token",
				);
			}

			const parseUser = await new Parse.Query(Parse.User).get(user, {
				useMasterKey: true,
			});

			if (!parseUser) {
				throw new Parse.Error(
					Parse.Error.VALIDATION_ERROR,
					"Invalid credentials",
				);
			}

			return {
				save: {
					id: userId,
				},
				response: {
					user,
					instance,
				},
			};
		} catch (e) {
			console.log(e);
			throw new Parse.Error(
				Parse.Error.VALIDATION_ERROR,
				"Invalid token",
			);
		}
	}
}
