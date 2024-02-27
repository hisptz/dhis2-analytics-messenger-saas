import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDHIS2Client } from "./dhis2Client";
import { cloneDeep, get, isEmpty } from "lodash";
import {
	getDisabledOptions,
	getOptionsFromVisualization,
	getRequestOptions,
} from "../utils/options";
import {
	apiFetchAnalytics,
	apiFetchAnalyticsForYearOverYear,
	computeGenericPeriodNames,
	computeGenericPeriodNamesFromMatrix,
	computeYoYMatrix,
	getRelativePeriodTypeUsed,
} from "../utils/data";
import {
	DIMENSION_ID_PERIOD,
	isYearOverYear,
	layoutGetDimensionItems,
} from "@dhis2/analytics";
import { removeItemAllFromAxisItems } from "../utils/visualization";
import { fields } from "../constants";

export function useVisualization(id?: string) {
	const client = useDHIS2Client();
	const fetchData = async () => {
		if (!id) return;
		const url = `/visualizations/${id}?fields=${fields}`;
		const response = await client.get(url);
		return response.data;
	};

	return useQuery({
		queryKey: [id],
		queryFn: fetchData,
	});
}

export function useVisualizationData(visualization: Record<string, any>) {
	const client = useDHIS2Client();
	const fetchLegendSets = async () => {
		const legendSetIds = visualization.legendSets?.map(
			(x: { id: string }) => x.id,
		);
		if (isEmpty(legendSetIds)) return null;
		const url = `/legendSets/?filter=id:in:[${legendSetIds.join(",")}]`;
		const response = await client.get(url);
		return response.data.legendSets;
	};
	const fetchOrgUnitLevels = async () => {
		const url = `/organisationUnitLevels?fields=*`;
		const response = await client.get(url);
		return response.data.organisationUnitLevels;
	};
	const fetchData = async () => {
		const disabledOptions = getDisabledOptions({
			visType: visualization.type,
			options: getOptionsFromVisualization(visualization),
		});

		const filteredVisualization = cloneDeep(visualization);

		Object.keys(disabledOptions).forEach(
			(option) => delete filteredVisualization[option],
		);

		const adaptedVisualization: Record<string, any> = {
			...filteredVisualization,
			columns: removeItemAllFromAxisItems(visualization.columns as any),
			rows: removeItemAllFromAxisItems(visualization.rows as any),
			filters: removeItemAllFromAxisItems(visualization.filters as any),
		};
		const options = getRequestOptions({
			visualization: adaptedVisualization,
			filters: {},
		});

		const extraOptions = {
			dashboard: true,
		};

		if (isYearOverYear(adaptedVisualization.type)) {
			const { responses, yearlySeriesLabels } =
				await apiFetchAnalyticsForYearOverYear({
					client,
					visualization: adaptedVisualization,
					options,
				});

			const peItems = layoutGetDimensionItems(
				adaptedVisualization,
				DIMENSION_ID_PERIOD,
			);

			const relativePeriodTypeUsed = getRelativePeriodTypeUsed(peItems);

			const periodKeyAxisIndexMatrix = computeYoYMatrix(
				responses,
				relativePeriodTypeUsed,
			);
			const periodKeyAxisIndexMap = periodKeyAxisIndexMatrix.reduce(
				(map: { [x: string]: any }, periodKeys: any[], index: any) => {
					periodKeys.forEach((periodKey) => (map[periodKey] = index));

					return map;
				},
				{},
			);

			const xAxisLabels = relativePeriodTypeUsed
				? computeGenericPeriodNamesFromMatrix(
						periodKeyAxisIndexMatrix,
						relativePeriodTypeUsed,
				  )
				: computeGenericPeriodNames(responses);

			return {
				responses,
				extraOptions: {
					...extraOptions,
					yearlySeries: yearlySeriesLabels,
					xAxisLabels,
					periodKeyAxisIndexMap,
				},
			};
		}

		return {
			responses: await apiFetchAnalytics({
				client,
				visualization: adaptedVisualization,
				options,
			}),
			extraOptions,
		};
	};

	return useQueries({
		queries: [
			{
				queryKey: ["legendSets"],
				queryFn: fetchLegendSets,
			},
			{
				queryKey: ["organisationUnitLevels"],
				queryFn: fetchOrgUnitLevels,
			},
			{
				queryKey: ["data"],
				queryFn: fetchData,
			},
		],
		combine: (results) => {
			return {
				isLoading: results.reduce((acc, curr) => {
					return curr.isLoading || acc;
				}, false),
				isError: results.reduce((acc, curr) => {
					return curr.isError || acc;
				}, false),
				data: {
					legendSets: get(results, 0)?.data,
					orgUnitLevels: get(results, 1)?.data,
					data: get<UseQueryResult>(results, 2)?.data,
				},
				error: {
					legendSets: get(results, 0)?.error,
					orgUnitLevels: get(results, 1)?.error,
					data: get(results, 2)?.error,
				},
			};
		},
	});
}
