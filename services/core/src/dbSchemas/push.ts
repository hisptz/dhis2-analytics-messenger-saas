import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

const pushJobFields: ParseField[] = [
	{
		name: "contacts",
		type: "Array",
		options: {
			required: true,
		},
	},
	{
		type: "Pointer",
		targetClass: "DHIS2Instance",
		name: "dhis2Instance",
	},
	{
		name: "description",
		type: "String",
	},
	{
		name: "name",
		type: "String",
	},
	{
		name: "visualizations",
		type: "Array",
	},
	{
		name: "visualizationGroup",
		type: "String",
	},
	{
		name: "schedules",
		type: "Array",
	},
];
export const ANALYTICS_JOB_CLASSNAME = "AnalyticsPushJob";

const pushJobSchema = generateSchema(ANALYTICS_JOB_CLASSNAME, pushJobFields);

const pushJobStatusFields: ParseField[] = [
	{
		name: "job",
		targetClass: "AnalyticsPushJob",
		type: "Pointer",
		options: {
			required: true,
		},
	},
	{
		name: "trigger",
		type: "String", //Manual or Scheduled
	},
	{
		name: "startTime",
		type: "Date",
	},
	{
		name: "endTime",
		type: "Date",
	},
	{
		name: "status",
		type: "String",
	},
	{
		name: "logs",
		type: "String",
	},
];
export const ANALYTICS_JOB_STATUS_CLASSNAME = "AnalyticsPushJobStatus";

const pushJobStatusSchema = generateSchema(
	ANALYTICS_JOB_STATUS_CLASSNAME,
	pushJobStatusFields,
);

export const analyticsJobSchema = [pushJobSchema, pushJobStatusSchema];
