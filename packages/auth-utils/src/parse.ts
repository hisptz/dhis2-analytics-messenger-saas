import Parse from "parse/node";

/*
 *
 * This is assumed these env variables are passed from the respective service
 * */
Parse.initialize(
	process.env.AUTH_APP_ID as string,
	"",
	process.env.AUTH_MASTER_KEY,
);
Parse.serverURL = process.env.AUTH_SERVER_URL as string;

export default Parse;
