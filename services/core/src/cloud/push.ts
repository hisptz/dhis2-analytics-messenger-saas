import { ANALYTICS_JOB_CLASSNAME } from "../dbSchemas/push";
import { scheduleJob } from "../services/scheduling";

Parse.Cloud.afterSave(ANALYTICS_JOB_CLASSNAME, async (request) => {
	const { object } = request;
	await scheduleJob(object);
});
