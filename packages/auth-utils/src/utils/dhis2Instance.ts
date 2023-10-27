/*
 * This helpers get the dhis2 instance config based on the token provided
 * */

import { DHIS2Config } from "../types/dhis2";
import axios from "axios";

export async function getDHIS2Config(token: string): Promise<DHIS2Config> {
	const authServer = process.env.AUTH_SERVER_URL;

	const response = await axios.get<DHIS2Config>(`${authServer}/auth/dhis2`, {
		headers: {
			token,
		},
	});
	return response.data;
}
