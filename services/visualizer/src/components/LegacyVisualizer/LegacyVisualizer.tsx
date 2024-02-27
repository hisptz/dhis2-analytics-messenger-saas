import { useParams, useSearchParams } from "react-router-dom";
import { CssReset } from "@dhis2/ui";
import { Visualization } from "./components/Visualization";
import { useVisualization } from "../../hooks/config";

export function LegacyVisualizer() {
	const [searchParams] = useSearchParams();
	const height = searchParams.get("height") ?? "1080";
	const width = searchParams.get("width") ?? "1920";
	const { id } = useParams();
	const { isLoading, isError, data, error } = useVisualization(id);
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div id="errro">{error.message}</div>;
	}

	console.log(data);

	return (
		<div
			id={"visualization"}
			style={{
				display: "flex",
				flexDirection: "column",
				height: parseInt(height),
				width: parseInt(width),
				textAlign: "center",
				padding: 16,
			}}
		>
			<CssReset />
			<div
				style={{
					flexGrow: 1,
					minHeight: "100%",
					height: "100%",
					width: "100%",
					minWidth: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "stretch",
				}}
			>
				<Visualization visualization={data} />
			</div>
		</div>
	);
}
