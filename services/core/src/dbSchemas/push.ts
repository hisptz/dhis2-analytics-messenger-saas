import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

const contactFields: ParseField[] = [
	{
		type: "String",
		name: "type",
	},
	{
		type: "String",
		name: "clientType",
	},
	{
		type: "String",
		name: "identifier",
	},
	{
		type: "Pointer",
		targetClass: "DHIS2Instance",
		name: "dhis2Instance",
	},
];

export const CONTACT_CLASSNAME = "Contact";

const contactSchema = generateSchema(CONTACT_CLASSNAME, contactFields);

const visualizationFields: ParseField[] = [
	{
		name: "name",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		name: "visualizationId",
		type: "String",
		options: {
			required: true,
		},
	},
	{
		type: "Pointer",
		targetClass: "DHIS2Instance",
		name: "dhis2Instance",
	},
];

export const VISUALIZATION_CLASSNAME = "Visualization";

const visualizationSchema = generateSchema(
	VISUALIZATION_CLASSNAME,
	visualizationFields,
);

const pushJobFields: ParseField[] = [
	{
		name: "contact",
		type: "Pointer",
		targetClass: "Contact",
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
		name: "visualizations",
		targetClass: "Visualization",
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
		name: "schedule",
		type: "Pointer",
		targetClass: "AnalyticsPushJobSchedule",
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

const pushJobScheduleFields: ParseField[] = [
	{
		name: "job",
		targetClass: "AnalyticsPushJob",
		type: "Pointer",
		options: {
			required: true,
		},
	},
	{
		name: "enabled",
		type: "Boolean",
	},
	{
		name: "cron",
		type: "String",
		options: {
			required: true,
		},
	},
];

export const ANALYTICS_JOB_SCHEDULE_CLASSNAME = "AnalyticsPushJobSchedule";

const pushJobScheduleSchema = generateSchema(
	ANALYTICS_JOB_SCHEDULE_CLASSNAME,
	pushJobScheduleFields,
);

export const analyticsJobSchema = [
	contactSchema,
	visualizationSchema,
	pushJobSchema,
	pushJobStatusSchema,
	pushJobScheduleSchema,
];
