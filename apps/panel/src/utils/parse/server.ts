import ParseServer from "parse/node";

const serverUrl =
	process.env.NEXT_PUBLIC_PARSE_BASE_URL ?? "http://localhost:4000";
const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID ?? "DAM-AUTH";

ParseServer.initialize(appId);
ParseServer.serverURL = serverUrl;

export { ParseServer };
