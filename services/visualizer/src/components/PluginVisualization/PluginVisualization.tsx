import { useVisualization } from "../../hooks/config";
import { useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getPluginURL } from "./utils/plugin";
import postRobot from "@krakenjs/post-robot";

interface PluginProps {
	cacheId: string;
	recordOnNextLoad: boolean;
	isParentCached: boolean;
	visualization: Record<string, any>;
	forDashboard: boolean;
	onError: (error: any) => void;
}

export type Type = "map" | "visualization";

export function PluginVisualization() {
	const ref = useRef<HTMLIFrameElement>(null);
	const [searchParams] = useSearchParams();
	const dhis2URL = searchParams.get("dhis2URL") as string;
	const { id, type } = useParams<{
		id: string;
		type: Type;
	}>();
	const { data } = useVisualization(id as string);
	const onError = useCallback((error: any) => {
		console.log(error);
	}, []);
	const pluginProps: PluginProps | undefined = useMemo(() => {
		if (!data) {
			return;
		}
		return {
			isVisualizationLoaded: true,
			forDashboard: true,
			cacheId: `dhis2-visualizer-${id}`,
			isParentCached: false,
			recordOnNextLoad: true,
			visualization: data,
			onError,
		} as PluginProps;
	}, [data, onError, id]);
	const launchURL = getPluginURL(dhis2URL, type as Type);

	useEffect(() => {
		const listener = postRobot.on(
			"getProps",
			{
				window: ref.current?.contentWindow,
			},
			() => {
				return pluginProps;
			},
		);

		return () => listener.cancel();
	}, []);

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<iframe
			style={{
				width: "100%",
				height: "100%",
				border: "none",
			}}
			ref={ref}
			src={launchURL}
		/>
	);
}
