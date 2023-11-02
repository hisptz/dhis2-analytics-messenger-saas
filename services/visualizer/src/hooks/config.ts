import { useParams, useSearchParams } from "react-router-dom";
import { getDHIS2Client } from "../utils/dhis2Client";
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
import { useElementSize } from "usehooks-ts";
import { ChartConfig } from "@hisptz/dhis2-analytics";
import { Layout } from "../components/Visualization/components/LayoutProvider";

export function useVisualizationConfig() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const dhis2URL = searchParams.get("dhis2URL");
	const dhis2PAT = searchParams.get("dhis2PAT");
	const height = searchParams.get("height") ?? "1080";

	const fetchData = async () => {
		const url = `/visualizations/${id}`;
		const client = getDHIS2Client(dhis2URL as string, dhis2PAT as string);
		const response = await client.get(url);
		return JSON.parse(response.data);
	};

	const { data, isLoading, error } = useQuery({
		queryKey: [id],
		queryFn: fetchData,
	});

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
