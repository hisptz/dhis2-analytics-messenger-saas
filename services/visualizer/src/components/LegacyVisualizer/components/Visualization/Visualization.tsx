import React from "react";
import { useVisualizationData } from "../../../../hooks/config";
import { Chart } from "./components/Chart/Chart";
import { PivotTable, VIS_TYPE_PIVOT_TABLE } from "@dhis2/analytics";
import { head } from "lodash";

export interface VisualizationProps {
	visualization: Record<string, any>;
}

export function Visualization({
	visualization,
}: VisualizationProps): React.ReactNode {
	const { data, error, isLoading, isError } =
		useVisualizationData(visualization);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return (
			<div>
				{error?.legendSets?.message ||
					error?.orgUnitLevels?.message ||
					error?.data?.message}
			</div>
		);
	}

	if (data) {
		if (visualization.type === VIS_TYPE_PIVOT_TABLE) {
			return (
				<PivotTable
					visualization={visualization}
					data={head((data.data as any)?.responses)}
					legendSets={data.legendSets}
					renderCounter={0}
					onToggleContextualMenu={() => {}}
				/>
			);
		}
		return (
			<Chart
				data={(data.data as any).responses}
				visualization={visualization}
				extraOptions={{
					...(data.data as any).extraOptions,
					legendSets: data.legendSets,
				}}
			/>
		);
	}
}
