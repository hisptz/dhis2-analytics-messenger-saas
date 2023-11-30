import logger from "./logging";
import Parse from "parse/node";
import { ANALYTICS_JOB_CLASSNAME } from "../dbSchemas/push";
import { CronJob } from "cron";
import { compact, remove, set } from "lodash";

Parse.initialize(
	process.env.AUTH_APP_ID ?? "DAM-AUTH",
	"",
	process.env.AUTH_MASTER_KEY ?? "MasterKey",
);
Parse.serverURL = process.env.AUTH_SERVER_URL ?? "http://localhost:3000/api";

export const scheduledJobs: { id: string; job: CronJob }[] = [];

async function initializeJobs(jobs: Parse.Object[]) {
	logger.info(`Initializing ${jobs.length} jobs`);
	for (const job of jobs) {
		await scheduleJob(job);
	}
	logger.info(`Initialized ${jobs.length} jobs`);
}

export async function scheduleJob(job: Parse.Object) {
	const schedules = job.get("schedules") as Array<{
		enabled: boolean;
		cron: string;
	}>;

	const activeJobSchedules = scheduledJobs.filter((scheduleJob) =>
		scheduleJob.id.includes(job.id),
	);

	const killedJobs = activeJobSchedules.filter(
		(scheduleJob) =>
			!schedules.find((schedule) =>
				scheduleJob.id.includes(schedule.cron),
			),
	);

	for (const schedule of schedules) {
		const scheduledJobId = `${job.id}-${schedule.cron}`;
		const alreadyScheduledJob = compact(scheduledJobs).find(
			({ id }) => id === scheduledJobId,
		);
		if (alreadyScheduledJob) {
			logger.info(`Killing job to reschedule...`);
			alreadyScheduledJob.job.stop();
			const updatedJob = new CronJob(
				schedule.cron,
				async () => {
					logger.info(`Starting job ${job.id} at ${new Date()}`);
					await pushJob(job);
				},
				() => {
					logger.info("job finished");
				},
				false,
			);
			const index = scheduledJobs.findIndex(
				({ id }) => id === scheduledJobId,
			);
			set(scheduledJobs, index, updatedJob);
			continue;
		}
		const scheduledJob = new CronJob(
			schedule.cron,
			async () => {
				logger.info(`Starting job ${job.id} at ${new Date()}`);
				await pushJob(job);
			},
			() => {
				logger.info("job finished");
			},
			false,
		);
		scheduledJob.start();
		scheduledJobs.push({ id: scheduledJobId, job: scheduledJob });
	}
	for (const killedJob of killedJobs) {
		killedJob.job.stop();
		remove(scheduledJobs, (job) => job.id === killedJob.id);
	}
}

async function pushJob(job: Parse.Object) {
	return await Parse.Cloud.run(
		"runScheduledAnalyticsPushJob",
		{
			jobId: job.id,
			trigger: "SCHEDULER",
		},
		{
			useMasterKey: true,
		},
	);
}

export async function initializeSchedules() {
	logger.info(`Initializing all enabled job schedules`);
	const jobsQuery = new Parse.Query(ANALYTICS_JOB_CLASSNAME);
	const count = await jobsQuery.count({
		useMasterKey: true,
	});
	if (count === 0) {
		logger.info(`No jobs found`);
		return;
	}
	if (count > 100) {
		logger.warn(`Found ${count} jobs, this might take a while.`);
		const pageSize = 100;
		const pages = Math.ceil(count / pageSize);
		for (let i = 0; i < pages; i++) {
			logger.info(`Initializing batch ${i + 1} of ${pages}`);
			const results = await jobsQuery
				.limit(pageSize)
				.skip(i * pageSize)
				.find({
					useMasterKey: true,
				});
			await initializeJobs(results);
		}
		return;
	}
}
