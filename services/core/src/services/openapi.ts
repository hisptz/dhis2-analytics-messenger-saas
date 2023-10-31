import path from "path";
import { Express } from "express";
import { initialize } from "express-openapi";
import apiDoc from "../docs";
import { config } from "dotenv";
import swagger from "swagger-ui-express";

config();

const apiMountPoint = process.env.API_MOUNT_POINT || "/api";

export async function initOpenAPI(app: Express) {
	return await initialize({
		app,
		apiDoc,
		routesGlob: "**/*.{ts,js}",
		paths: path.resolve(__dirname, "routes/v1"),
		routesIndexFileRegExp: /(?:index)?\.[tj]s$/,
		exposeApiDocs: true,
		docsPath: `/docs`,
	}).then(() => {
		app.use(
			`${apiMountPoint}/docs`,
			swagger.serve,
			swagger.setup(
				{},
				{
					swaggerOptions: {
						url: `${apiMountPoint}/openapi`,
					},
				},
			),
		);
	});
}
