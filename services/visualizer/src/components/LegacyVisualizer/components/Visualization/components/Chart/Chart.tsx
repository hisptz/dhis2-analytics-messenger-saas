import { useEffect, useRef } from "react";
import { createVisualization, isSingleValue } from "@dhis2/analytics";

export interface ChartProps {
	visualization: Record<string, any>;
	data: Array<Record<string, any>>;
	extraOptions: Record<string, any>;
}

export function Chart({ data, visualization, extraOptions }: ChartProps) {
	const ref = useRef<HTMLDivElement>(null);
	const render = () => {
		createVisualization(
			data,
			visualization,
			ref.current,
			{
				...extraOptions,
			},
			undefined,
			undefined,
			isSingleValue(visualization.type) ? "dhis" : "highcharts",
		);
	};

	useEffect(() => {
		render();
	}, [visualization]);

	return <div style={{ width: "100%", height: "100%" }} ref={ref}></div>;
}
