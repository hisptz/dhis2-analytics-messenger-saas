import { createContext, useContext, useMemo } from "react";
import { Analytics, AnalyticsDimension } from "@hisptz/dhis2-utils";
import { useDimensions } from "../DimensionsProvider";
import { useLayout } from "../LayoutProvider";
import { forEach, set } from "lodash";
import { useDHIS2Client } from "../../../../hooks/dhis2Client";
import { useQuery } from "@tanstack/react-query";

const AnalyticsContext = createContext<
	{ loading: boolean; analytics: Analytics } | undefined
>(undefined);

export interface DataProviderProps {
	children: React.ReactNode;
}

export function useAnalyticsData() {
	return useContext(AnalyticsContext) ?? { analytics: {}, loading: false };
}

export function AnalyticsDataProvider({ children }: DataProviderProps) {
	const [analyticsDimensions] = useDimensions();
	const [layout] = useLayout();
	const { dimensions, filters } = useMemo(() => {
		const dimensions: Record<string, any> = {};
		const filters: Record<string, any> = {};

		forEach(
			[...(layout?.columns ?? []), ...(layout?.rows ?? [])],
			(dimension) => {
				set(
					dimensions,
					[dimension],
					(analyticsDimensions as AnalyticsDimension)?.[dimension],
				);
			},
		);
		forEach([...(layout?.filters ?? [])], (dimension) => {
			set(
				filters,
				[dimension],
				(analyticsDimensions as AnalyticsDimension)?.[dimension],
			);
		});

		return {
			dimensions,
			filters,
		};
	}, [layout, analyticsDimensions]);

	const dhis2Client = useDHIS2Client();

	const fetchData = async () => {
		const url = `analytics`;
		const params = {
			includeMetadataDetails: "true",
			includeNumDen: "true",
			displayProperty: "NAME",
			dimension: Object.keys(dimensions)
				.map(
					(dimension) =>
						`${dimension}:${dimensions[dimension]?.join(";")}`,
				)
				.join(","),
			filter: Object.keys(filters)
				.map(
					(dimension) =>
						`${dimension}:${filters[dimension]?.join(";")}`,
				)
				.join(","),
		};
		const searchParams = new URLSearchParams(params);

		const response = await dhis2Client.get(
			`${url}?${searchParams.toString()}`,
		);
		return JSON.parse(response.data) as Analytics;
	};

	const { data: analytics, isLoading: loading } = useQuery({
		queryKey: [dimensions, filters],
		queryFn: fetchData,
	});

	return (
		<AnalyticsContext.Provider
			value={{ analytics: analytics as Analytics, loading }}
		>
			{children}
		</AnalyticsContext.Provider>
	);
}
