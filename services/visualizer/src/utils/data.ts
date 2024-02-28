import { CustomDataEngine } from "./engine/engine";
import { Axios } from "axios";
import {
	Analytics,
	DAILY,
	DIMENSION_ID_PERIOD,
	getRelativePeriodsOptionsById,
	layoutGetDimensionItems,
	VIS_TYPE_PIVOT_TABLE,
	WEEKLY,
	WEEKS_THIS_YEAR,
} from "@dhis2/analytics";
import { getOptionsForUi, options } from "./options";
import { pick } from "lodash";

const periodId = DIMENSION_ID_PERIOD;

export async function apiFetchAnalytics({
	client,
	visualization,
	options,
}: {
	client: Axios;
	visualization: Record<string, any>;
	options: Record<string, any>;
}): Promise<any> {
	const engine = new CustomDataEngine(client);
	const analyticsEngine = Analytics.getAnalytics(engine);

	const req = new analyticsEngine.request()
		.fromVisualization(visualization)
		.withParameters(options)
		.withIncludeNumDen(visualization.type === VIS_TYPE_PIVOT_TABLE);

	const rawResponse = await analyticsEngine.aggregate.get(req);

	return [new analyticsEngine.response(rawResponse)];
}

export const apiFetchAnalyticsForYearOverYear = async ({
	client,
	visualization,
	options,
}: {
	client: Axios;
	visualization: Record<string, any>;
	options: Record<string, any>;
}) => {
	const engine = new CustomDataEngine(client);
	const analyticsEngine = Analytics.getAnalytics(engine);

	let yearlySeriesReq = new analyticsEngine.request()
		.addPeriodDimension(visualization.yearlySeries)
		.withSkipData(true)
		.withSkipMeta(false)
		.withIncludeMetadataDetails(true);

	if (options.relativePeriodDate) {
		yearlySeriesReq = yearlySeriesReq.withRelativePeriodDate(
			options.relativePeriodDate,
		);
	}

	const yearlySeriesRes =
		await analyticsEngine.aggregate.fetch(yearlySeriesReq);

	const periodDates = [];
	const yearlySeriesLabels: any[] = [];

	const now = new Date();
	const currentDay = ("" + now.getDate()).padStart(2, "0");
	const currentMonth = ("" + (now.getMonth() + 1)).padStart(2, "0");

	const periodItems = layoutGetDimensionItems(visualization, periodId);

	// relative week period in use
	if (
		getRelativePeriodTypeUsed(periodItems) === WEEKLY &&
		!periodItems[0].id === WEEKS_THIS_YEAR
	) {
		const relativeWeeksData = await prepareRequestsForRelativeWeeks({
			analyticsEngine,
			visualization,
			options,
			yearlySeriesRes,
			currentMonth,
			currentDay,
		});

		periodDates.push(...relativeWeeksData.periodDates);
		yearlySeriesLabels.push(...relativeWeeksData.yearlySeriesLabels);
	} else if (getRelativePeriodTypeUsed(periodItems) === DAILY) {
		const relativeDaysData = prepareRequestsForRelativeDays({
			yearlySeriesRes,
			currentMonth,
			currentDay,
		});

		periodDates.push(...relativeDaysData.periodDates);
		yearlySeriesLabels.push(...relativeDaysData.yearlySeriesLabels);
	} else {
		yearlySeriesRes.metaData.dimensions[periodId]
			.sort()
			.reverse()
			.forEach((year: string | number) => {
				yearlySeriesLabels.push(
					yearlySeriesRes.metaData.items[year].name,
				);

				periodDates.push(`${year}-${currentMonth}-${currentDay}`);
			});
	}

	// request analytics data/metaData for each year in the serie with its own specific relativePeriodDate
	const requests = periodDates.reduce((list: any[], periodDate) => {
		const req = new analyticsEngine.request()
			.fromVisualization(visualization)
			.withParameters(options)
			.withRelativePeriodDate(periodDate);

		list.push(analyticsEngine.aggregate.get(req));

		return list;
	}, []);

	return Promise.all(requests).then((responses) => ({
		responses: responses.map((res) => new analyticsEngine.response(res)),
		yearlySeriesLabels,
	}));
};

const prepareRequestsForRelativeDays = ({
	yearlySeriesRes,
	currentMonth,
	currentDay,
}: any) => {
	const yearlySeriesLabels: any[] = [];
	const periodDates: string[] = [];

	const yearlySeriesIds = yearlySeriesRes.metaData.dimensions[periodId]
		.slice()
		.sort()
		.reverse();

	const isFeb29 = currentMonth === "02" && currentDay === "29";

	yearlySeriesIds.forEach((year: number) => {
		yearlySeriesLabels.push(yearlySeriesRes.metaData.items[year].name);

		const isLeapYear = new Date(year, 1, 29).getDate() === 29;

		// 1. check if current date is feb 29
		// 2. check if current year is NOT a leap year
		if (isFeb29 && !isLeapYear) {
			// 3. use feb 28 for that year as relativePeriodDate
			periodDates.push(`${year}-02-28`);
		} else {
			periodDates.push(`${year}-${currentMonth}-${currentDay}`);
		}
	});

	return { yearlySeriesLabels, periodDates };
};

// special handling for when a relative weeks period is selected as category
// this takes care of data alignment issues between different years when one of the years have 53 weeks
// and more in general when the returned weeks for different years are not exactly the same range
// and data points must be "shifted" in the right position
// See https://jira.dhis2.org/browse/DHIS2-9729
const prepareRequestsForRelativeWeeks = async ({
	analyticsEngine,
	visualization,
	options,
	yearlySeriesRes,
	currentMonth,
	currentDay,
}: any) => {
	const yearlySeriesLabels = [];
	const periodDates = [];

	const yearlySeriesIds = yearlySeriesRes.metaData.dimensions[periodId]
		.slice()
		.sort()
		.reverse();

	// 1. request metadata of last year of the serie (with relativePeriodDate === today)
	// 2. extract the last week number of the LAST_x_WEEKS period
	// 3. request metadata for the same week number for each one of the other years of the serie
	// 3. compute relativePeriodDate for each other year of the serie:
	//    this is done by adding 1 day to the endDate of the week period obtained above
	// 4. request analytics data/metaData for each year in the serie with its own specific relativePeriodDate
	const referencePeriodYear = yearlySeriesIds.shift();

	yearlySeriesLabels.push(
		yearlySeriesRes.metaData.items[referencePeriodYear].name,
	);

	periodDates.push(`${referencePeriodYear}-${currentMonth}-${currentDay}`);

	// 1. request metadata of last year of the serie (with relativePeriodDate === today)
	const referencePeriodReq = new analyticsEngine.request()
		.fromVisualization(visualization)
		.withParameters(options)
		.withRelativePeriodDate(
			`${referencePeriodYear}-${currentMonth}-${currentDay}`,
		)
		.withSkipData(true)
		.withSkipMeta(false);

	const referencePeriodRes =
		await analyticsEngine.aggregate.fetch(referencePeriodReq);

	// 2. extract the last week number of the LAST_x_WEEKS period
	//    special handling for the week 53 case as not all years have 53 weeks
	const referenceWeekPeriod =
		referencePeriodRes.metaData.dimensions[periodId].pop();
	const [referenceWeekYear, referenceWeekNumber] =
		referenceWeekPeriod.split("W");
	const referenceWeekYearDelta = referencePeriodYear - referenceWeekYear;

	const weekPeriods = yearlySeriesIds.reduce(
		(periods: string[], year: number) => {
			yearlySeriesLabels.push(yearlySeriesRes.metaData.items[year].name);

			periods.push(
				`${year - referenceWeekYearDelta}W${referenceWeekNumber}`,
			);

			// edge case for week 53, not all years have it, so request also week 52
			if (referenceWeekNumber === "53") {
				periods.push(`${year - referenceWeekYearDelta}W52`);
			}

			return periods;
		},
		[],
	);

	if (weekPeriods.length) {
		// 3. request metadata for the same week number for each one of the other years of the serie
		const weekPeriodsReq = new analyticsEngine.request()
			.addPeriodDimension(weekPeriods)
			.withSkipData(true)
			.withSkipMeta(false)
			.withIncludeMetadataDetails(true);

		const weekPeriodsRes =
			await analyticsEngine.aggregate.fetch(weekPeriodsReq);

		// 3. compute relativePeriodDate for each other year of the serie:
		//    this is done by adding 1 day to the endDate of the week period obtained above
		const seenYears: any[] = [];

		weekPeriodsRes.metaData.dimensions[periodId]
			.sort()
			.reverse()
			.forEach((period: string) => {
				const year = period.substr(0, 4);

				// make sure we only take W53 or W52 whichever is available
				if (!seenYears.includes(year)) {
					const periodDate = new Date(
						weekPeriodsRes.metaData.items[period].endDate,
					);
					periodDate.setDate(periodDate.getDate() + 1);

					periodDates.push(
						`${periodDate.getFullYear()}-${(
							"" +
							(periodDate.getMonth() + 1)
						).padStart(2, "0")}-${(
							"" + periodDate.getDate()
						).padStart(2, "0")}`,
					);

					seenYears.unshift(year);
				}
			});
	}

	return { yearlySeriesLabels, periodDates };
};

export const getRelativePeriodTypeUsed = (periodItems: { id: any }[]) => {
	if (
		getRelativePeriodsOptionsById(WEEKLY)
			.getPeriods()
			.find((period: { id: any }) => period.id === periodItems[0].id)
	) {
		return WEEKLY;
	} else if (
		getRelativePeriodsOptionsById(DAILY)
			.getPeriods()
			.find((period: { id: any }) => period.id === periodItems[0].id)
	) {
		return DAILY;
	}
};

export const computeYoYMatrix = (
	responses: any[],
	relativePeriodTypeUsed: string,
) => {
	const periodGroups = responses.reduce((list, res) => {
		list.push(res.metaData.dimensions.pe);

		return list;
	}, []);

	if (relativePeriodTypeUsed === DAILY) {
		periodGroups.sort(
			(a: any[], b: any[]) => a[0].substr(-2) - b[0].substr(-2),
		);

		const periodKeyAxisIndexMatrix = periodGroups
			.shift()
			.map((periodId: any) => [periodId]);

		periodGroups.forEach((periodGroup: any[]) => {
			periodGroup.forEach((periodId) => {
				const matchGroups = periodId.match(/(\d{4})(\d{2})(\d{2})/);

				const month = matchGroups[2];
				const day = matchGroups[3];

				// find same month/day in 1st "serie"
				const xAxisIndexForPeriod = periodKeyAxisIndexMatrix.findIndex(
					(periodKeys: string[]) =>
						periodKeys[0].substr(4) === `${month}${day}`,
				);

				if (xAxisIndexForPeriod !== -1) {
					periodKeyAxisIndexMatrix[xAxisIndexForPeriod].push(
						periodId,
					);
				} else if (month === "02" && day === "29") {
					// February 29 special case
					// find index for february 28
					const indexForFeb28 = periodKeyAxisIndexMatrix.findIndex(
						(periodKeys: any[]) =>
							periodKeys.findIndex((periodKey) =>
								/0228$/.test(periodKey),
							) !== -1,
					);

					if (indexForFeb28 !== -1) {
						periodKeyAxisIndexMatrix.splice(indexForFeb28 + 1, 0, [
							periodId,
						]);
					} else {
						periodKeyAxisIndexMatrix.push([periodId]);
					}
				} else {
					periodKeyAxisIndexMatrix.push([periodId]);
				}
			});
		});

		return periodKeyAxisIndexMatrix;
	} else if (relativePeriodTypeUsed === WEEKLY) {
		periodGroups.sort(
			(a: any[], b: any[]) => b[0].split("W")[1] - a[0].split("W")[1],
		);

		const periodKeyAxisIndexMatrix = periodGroups
			.shift()
			.map((periodId: any) => [periodId]);

		periodGroups.forEach((periodGroup: any[]) => {
			periodGroup.forEach((periodId) => {
				const [year, week] = periodId.split("W");

				// find week number in 1st "serie"
				const xAxisIndexForPeriod = periodKeyAxisIndexMatrix.findIndex(
					(periodKeys: string[]) =>
						periodKeys[0].split("W")[1] === week,
				);

				if (xAxisIndexForPeriod !== -1) {
					periodKeyAxisIndexMatrix[xAxisIndexForPeriod].push(
						periodId,
					);
				} else if (week === "1") {
					const indexForW2 = periodKeyAxisIndexMatrix.findIndex(
						(periodKeys: any[]) =>
							periodKeys.findIndex((periodKey) =>
								/W2$/.test(periodKey),
							) !== -1,
					);

					if (indexForW2 !== -1) {
						periodKeyAxisIndexMatrix[indexForW2].push(periodId);
					} else {
						periodKeyAxisIndexMatrix.push([periodId]);
					}
				} else {
					// find the right spot considering also the year
					const indexForPrevWeekInYear =
						periodKeyAxisIndexMatrix.findIndex(
							(periodKeys: any[]) =>
								periodKeys.findIndex(
									(periodKey) =>
										periodKey === `${year}W${week - 1}`,
								) !== -1,
						);

					periodKeyAxisIndexMatrix.splice(
						indexForPrevWeekInYear + 1,
						0,
						[periodId],
					);
				}
			});
		});

		return periodKeyAxisIndexMatrix;
	} else {
		const periodKeyAxisIndexMatrix = periodGroups.reduce(
			(list: { [x: string]: any[] }, periodGroup: any[]) => {
				periodGroup.forEach((periodId, index) => {
					list[index].push(periodId);
				});

				return list;
			},
			Array.from({ length: periodGroups[0].length }, () => []),
		);

		return periodKeyAxisIndexMatrix;
	}
};

export const computeGenericPeriodNamesFromMatrix = (
	periodKeyAxisIndexMatrix: any[],
	relativePeriodTypeUsed: string,
) => {
	switch (relativePeriodTypeUsed) {
		case WEEKLY:
			return (
				periodKeyAxisIndexMatrix
					// remove year, return "Wnn"
					.map((periodKeys: string[]) => periodKeys[0].substr(4))
					.flat()
			);
		case DAILY:
			return periodKeyAxisIndexMatrix
				.map((periodKeys: string[]) =>
					// remove year, return "dd-mm"
					periodKeys[0].substr(4).replace(/(\d{2})(\d{2})/, "$2-$1"),
				)
				.flat();
	}
};

export const computeGenericPeriodNames = (responses: any[]) => {
	const xAxisRes = responses.reduce((out, res) => {
		if (out.metaData) {
			if (
				res.metaData.dimensions.pe.length >
				out.metaData.dimensions.pe.length
			) {
				out = res;
			}
		} else {
			out = res;
		}

		return out;
	}, {});

	const metadata = xAxisRes.metaData;

	return metadata.dimensions.pe.reduce(
		(genericPeriodNames: any[], periodId: string | number) => {
			const name = metadata.items[periodId].name;

			// until the day the backend will support this in the API:
			// trim off the trailing year in the period name
			// english names should all have the year at the end of the string
			genericPeriodNames.push(name.replace(/\s+\d{4}$/, ""));

			return genericPeriodNames;
		},
		[],
	);
};

export const getOptionsFromVisualization = (
	visualization: Record<string, any>,
) => {
	const optionsFromVisualization = {
		...getOptionsForUi(),
		...pick(visualization, Object.keys(options)),
	};

	// XXX only in app
	optionsFromVisualization.axes = optionsFromVisualization.axes.map(
		(axis: { targetLine: any; baseLine: any }) => {
			if (axis.targetLine || axis.baseLine) {
				const clonedAxis = { ...axis };
				if (clonedAxis.targetLine) {
					clonedAxis.targetLine = {
						...clonedAxis.targetLine,
						enabled: true,
					};
				}
				if (clonedAxis.baseLine) {
					clonedAxis.baseLine = {
						...clonedAxis.baseLine,
						enabled: true,
					};
				}
				return clonedAxis;
			} else {
				return axis;
			}
		},
	);

	// if array has at least one element, convert into boolean
	optionsFromVisualization.icons = Boolean(visualization.icons?.length);

	// nested options under reportingParams
	if (visualization.reportingParams) {
		optionsFromVisualization.organisationUnit =
			visualization.reportingParams.organisationUnit;
		optionsFromVisualization.reportingPeriod =
			visualization.reportingParams.reportingPeriod;
		optionsFromVisualization.parentOrganisationUnit =
			visualization.reportingParams.parentOrganisationUnit;
		optionsFromVisualization.grandParentOrganisationUnit =
			visualization.reportingParams.grandParentOrganisationUnit;
	}

	// cast option values from Number for some options
	["sortOrder", "topLimit"].forEach((option) => {
		if (Object.prototype.hasOwnProperty.call(visualization, option)) {
			optionsFromVisualization[option] = String(visualization[option]);
		}
	});

	return optionsFromVisualization;
};
