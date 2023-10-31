import Parse from "parse/node";

const serverURL = process.env.SERVER_URL ?? "http://localhost:3001/api";
const appId = process.env.APP_ID ?? "DAM-AUTH";

Parse.initialize(appId);
Parse.serverURL = serverURL;

export default Parse;
