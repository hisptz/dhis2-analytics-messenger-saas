import { useQuery } from "@tanstack/react-query";
import Parse from "parse";

export function useDHIS2Instance(id: string) {
	async function fetchData() {
		return await new Parse.Query("DHIS2Instance").get(id);
	}

	return useQuery({
		queryKey: [id],
		queryFn: fetchData,
	});
}
