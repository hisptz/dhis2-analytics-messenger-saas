import { dhis2InstanceSchema } from "./schemas/dhis2Instance";
import { whatsappClientSchema } from "./schemas/whatsappClient";
import { asyncify, forEach } from "async";
import { ParseSchema } from "./schemas/base";

const schemas = [dhis2InstanceSchema, whatsappClientSchema];
/*
 * A script to initialize the server with initial schema.
 *
 * */

Parse.Cloud.job("migrateSchemas", async function () {
	await forEach(
		schemas,
		asyncify(async (schema: ParseSchema) => schema.save()),
	);
});
