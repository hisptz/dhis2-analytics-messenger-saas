import { Axios } from "axios";
import { getDHIS2Config } from "./dhis2Instance";

export async function getDHIS2Client(token: string): Promise<Axios> {
	const dhisInstance = await getDHIS2Config(token);
	return new Axios({
		baseURL: dhisInstance.url,
		headers: {
			Authorization: `ApiToken ${dhisInstance.pat}`,
		},
	});
}
