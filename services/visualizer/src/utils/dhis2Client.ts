import axios, { Axios } from "axios";

export function getDHIS2Client(url: string, pat: string): Axios {
	return axios.create({
		baseURL: `${url}/api`,
		headers: {
			Authorization: `ApiToken ${pat}`,
		},
	});
}
