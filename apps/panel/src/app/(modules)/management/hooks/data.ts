import { useSuspenseQuery } from "@tanstack/react-query";
import Parse from "parse";

export function useDHIS2Instances() {
	const fetchData = async () => {
		const query = new Parse.Query("DHIS2Instance");
		query.includeAll();
		return (await query.find()) ?? [];
	};

	const { isLoading, data, refetch } = useSuspenseQuery({
		queryFn: fetchData,
		queryKey: ["dhis2Instances"],
	});

	return {
		isLoading,
		results: data,
		refetch,
	};
}
