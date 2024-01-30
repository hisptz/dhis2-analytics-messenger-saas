import { useSearchParams } from "react-router-dom";
import { useVisualizationConfig } from "../../hooks/config";
import { CssReset } from "@dhis2/ui";
import { Visualization } from "../Visualization";

export function LegacyVisualizer() {
	const [searchParams] = useSearchParams();
	const height = searchParams.get("height") ?? "1080";
	const width = searchParams.get("width") ?? "1920";
	const { loading, visualizationProps, displayName, error } =
		useVisualizationConfig();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

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
			<h2 style={{ flexGrow: 0 }}>{displayName}</h2>
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
				<Visualization {...visualizationProps} />
			</div>
		</div>
	);
}
