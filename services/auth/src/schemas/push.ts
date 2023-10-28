import { ParseField } from "../cloud/types";
import { generateSchema } from "./base";

const contactFields: ParseField[] = [
	{
		type: "String",
		name: "type",
	},
	{
		type: "String",
		name: "whatsappNumber",
	},
	{
		type: "Pointer",
		targetClass: "DHIS2Instance",
		name: "dhis2Instance",
	},
];

const contactSchema = generateSchema("Contact", contactFields);

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

const visualizationSchema = generateSchema(
	"Visualization",
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
		name: "description",
		type: "String",
	},
	{
		name: "visualizations",
		targetClass: "Visualization",
		type: "Array",
	},
];

const pushJobSchema = generateSchema("AnalyticsPushJob", pushJobFields);

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

const pushJobStatusSchema = generateSchema(
	"AnalyticsPushJobStatus",
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

const pushJobScheduleSchema = generateSchema(
	"AnalyticsPushJobSchedule",
	pushJobScheduleFields,
);

export const analyticsJobSchema = [
	contactSchema,
	visualizationSchema,
	pushJobSchema,
	pushJobStatusSchema,
	pushJobScheduleSchema,
];
