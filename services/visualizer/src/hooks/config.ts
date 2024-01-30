import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	getCategoryOptionGroupSets,
	getCategoryOptions,
	getConfig,
	getDataItems,
	getDefaultType,
	getLayout,
	getOrganisationUnitGroupSetDimensions,
	getOrgUnits,
	getPeriods,
} from "../utils/visualization";
import { ChartConfig } from "@hisptz/dhis2-analytics";
import { Layout } from "../components/Visualization/components/LayoutProvider";
import { useDHIS2Client } from "./dhis2Client";

export function useVisualization(id: string) {
	const client = useDHIS2Client();
	const fetchData = async () => {
		const url = `/visualizations/${id}?fields=*`;
		const response = await client.get(url);
		return JSON.parse(response.data);
	};

	return useQuery({
		queryKey: [id],
		queryFn: fetchData,
	});
}
export function useVisualizationConfig() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const height = searchParams.get("height") ?? "1080";

	const { data, isLoading, error } = useVisualization(id as string);

	const dimensions = useMemo(() => {
		if (!data) return;
		return {
			dx: getDataItems(data),
			pe: getPeriods(data),
			ou: getOrgUnits(data),
			...getCategoryOptions(data),
			...getOrganisationUnitGroupSetDimensions(data),
			...getCategoryOptionGroupSets(data),
		};
	}, [data]);

	const layout = useMemo(() => {
		if (!data) return;
		return getLayout(data) as Layout;
	}, [data]);
	const config = useMemo(() => {
		if (!data) return;
		return getConfig(data, {
			height: parseInt(height as string) - (64 + 16),
		}) as unknown as ChartConfig;
	}, [data]);
	const defaultVisualizationType = useMemo(() => {
		if (!data) return;
		return getDefaultType(data);
	}, [data]);
	const displayName = data?.displayName ?? "";

	return {
		visualizationProps: {
			layout,
			config,
			dimensions,
			defaultVisualizationType,
		},
		loading: isLoading,
		displayName,
		error,
	};
}
