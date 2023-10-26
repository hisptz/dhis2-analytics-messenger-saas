/*
 * This helpers get the dhis2 instance config based on the token provided
 * */

import { DHIS2Config } from "../types/dhis2";
import jwt from "jsonwebtoken";
import Parse from "../parse";

export async function getDHIS2Config(token: string): Promise<DHIS2Config> {
	const secretKey = process.env.AUTH_JWT_SECRET_KEY;
	if (!secretKey) {
		throw Error(
			"Variable `AUTH_JWT_SECRET_KEY` is required in the environment",
		);
	}
	try {
		const authData = jwt.verify(token, secretKey) as {
			user: string;
			dhis2Instance: string;
		};
		const dhis2InstanceId = authData.dhis2Instance;
		const dhis2Instance = new Parse.Object("DHIS2Instance").get(
			dhis2InstanceId,
		);

		await dhis2Instance.fetchWithInclude(["_User"], { useMasterKey: true });
		const url = dhis2Instance.get("url");
		const pat = dhis2Instance.get("pat");

		return {
			url,
			pat,
		};
	} catch (e) {
		throw Error("Invalid token");
	}
}
