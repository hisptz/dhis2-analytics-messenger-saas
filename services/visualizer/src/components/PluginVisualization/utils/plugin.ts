export function getPluginURL(baseURL: string, type: "map" | "visualization") {
	switch (type) {
		case "visualization":
			return `${baseURL}/dhis-web-data-visualizer/plugin.html`;
		case "map":
			return `${baseURL}/dhis-web-maps/plugin.html`;
	}
}
