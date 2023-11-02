import { useMemo } from "react";
import { useVisualizationType } from "../VisualizationTypeProvider";
import { useAnalyticsData } from "../AnalyticsDataProvider";
import { CircularLoader } from "@dhis2/ui";
import { useLayout } from "../LayoutProvider";
import { filter, find, findIndex, forEach, mapValues, set } from "lodash";
import { Dimension, useDimensions } from "../DimensionsProvider";
import i18n from "@dhis2/d2-i18n";
import {
	ChartAnalytics,
	ChartConfig,
	CustomPivotTable,
	CustomPivotTableOptions,
	Map,
	MapProps,
} from "@hisptz/dhis2-analytics";
import { VisualizationConfig } from "../../index";
import { OrgUnitSelection } from "@hisptz/dhis2-utils";

export interface VisualizationSelectorProps {
	config: VisualizationConfig;
}

export function getDimensionLabel(dimension: Dimension) {
	switch (dimension) {
		case "pe":
			return i18n.t("Period");
		case "ou":
			return i18n.t("Organisation unit");
		case "dx":
			return i18n.t("Data");
		default:
			return "";
	}
}

export function getOrgUnitSelectionFromIds(ous: string[]) {
	const orgUnitSelection: OrgUnitSelection = {
		orgUnits: [],
	};
	forEach(ous, (ou) => {
		if (ou === "USER_ORGUNIT") {
			set(orgUnitSelection, ["userOrgUnit"], true);
		} else if (ou === "USER_ORGUNIT_CHILDREN") {
			set(orgUnitSelection, ["userSubUnit"], true);
		} else if (ou === "USER_ORGUNIT_GRANDCHILDREN") {
			set(orgUnitSelection, ["userSubX2Unit"], true);
		} else {
			const orgUnits = [...(orgUnitSelection.orgUnits ?? [])];
			orgUnits.push({
				id: ou,
				children: [],
				path: "",
			});
			set(orgUnitSelection, ["orgUnits"], orgUnits);
		}
	});
	return orgUnitSelection;
}

export function PivotTableRenderer({
	options,
}: {
	options: CustomPivotTableOptions & {};
}) {
	const [layout] = useLayout();
	const { analytics } = useAnalyticsData();

	const sanitizedLayout = useMemo(() => {
		return mapValues(layout, (dimension) =>
			dimension.map((dimension) => ({
				dimension,
				label: getDimensionLabel(dimension),
			})),
		);
	}, [layout]);

	if (!analytics) {
		return null;
	}

	return (
		<CustomPivotTable
			tableProps={{
				scrollHeight: options.scrollHeight ?? "100%",
				scrollWidth: options.scrollWidth ?? "100%",
				width: options.width ?? "100%",
			}}
			analytics={analytics}
			config={{ layout: sanitizedLayout, options }}
		/>
	);
}

export function ChartRenderer({ options }: { options: ChartConfig }) {
	const { analytics } = useAnalyticsData();
	if (!analytics) {
		return null;
	}
	return <ChartAnalytics analytics={analytics} config={{ ...options }} />;
}

export function MapRenderer({
	options,
}: {
	options: Omit<MapProps, "orgUnitSelection" | "periodSelection">;
}) {
	const [dimensions] = useDimensions();
	const { analytics } = useAnalyticsData();
	const orgUnitSelection: OrgUnitSelection = useMemo(() => {
		return getOrgUnitSelectionFromIds(dimensions.ou ?? []);
	}, [dimensions.ou]);

	const thematicLayers: any[] = useMemo(() => {
		const valueIndex =
			findIndex(analytics.headers, ["name", "value"]) ?? -1;
		return (
			analytics.metaData?.dimensions["dx"]?.map((dataId) => {
				const config = find(options.thematicLayers, ["id", dataId]);
				const data: any[] =
					analytics.metaData?.dimensions?.ou?.map((ouId) => {
						const values = filter(
							analytics.rows,
							(row) => row.includes(dataId) && row.includes(ouId),
						) as unknown as string[];
						const value = values.reduce(
							(acc, value) => acc + parseFloat(value[valueIndex]),
							0,
						);
						return {
							data: value,
							dataItem: dataId,
							orgUnit: ouId,
						};
					}) ?? [];
				return {
					...config,
					data,
				};
			}) ?? []
		);
	}, [analytics]);

	return (
		<Map
			orgUnitSelection={orgUnitSelection}
			thematicLayers={thematicLayers}
		/>
	);
}

export function VisualizationSelector({ config }: VisualizationSelectorProps) {
	const [type] = useVisualizationType();
	const { analytics, loading } = useAnalyticsData();

	if (loading) {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
				}}
			>
				<CircularLoader small />
			</div>
		);
	}
	if (!analytics) {
		return null;
	}

	return (
		<>
			{type === "pivotTable" && (
				<PivotTableRenderer
					options={config?.pivotTable as CustomPivotTableOptions}
				/>
			)}
			{type === "chart" && (
				<ChartRenderer options={config?.chart as ChartConfig} />
			)}
			{type === "map" && (
				<MapRenderer
					options={
						config?.map as Omit<
							MapProps,
							"orgUnitSelection" | "periodSelection"
						>
					}
				/>
			)}
		</>
	);
}
