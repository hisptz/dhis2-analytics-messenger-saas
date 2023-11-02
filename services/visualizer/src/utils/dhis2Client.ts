import { Axios } from "axios";

export function getDHIS2Client(url: string, pat: string): Axios {
	return new Axios({
		baseURL: `${url}/api`,
		headers: {
			Authorization: `ApiToken ${pat}`,
		},
	});
}
