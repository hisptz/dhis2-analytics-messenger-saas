import { useSearchParams } from "react-router-dom";
import { getDHIS2Client } from "../utils/dhis2Client";

export function useDHIS2Client() {
	const [searchParams] = useSearchParams();
	const dhis2URL = searchParams.get("dhis2URL");
	const dhis2PAT = searchParams.get("dhis2PAT");

	if (!dhis2PAT || !dhis2URL) {
		throw Error(
			"Error setting up client. Make sure dhis2URL and dhis2PAT are passed as search params in the url",
		);
	}

	return getDHIS2Client(dhis2URL, dhis2PAT);
}
