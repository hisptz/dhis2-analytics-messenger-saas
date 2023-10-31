import i18n from "@dhis2/d2-i18n";
import {CronTime} from "cron-time-generator";
import {
    ControllerRenderProps,
    FieldValues,
    FormProvider,
    useController,
    useForm,
    useFormContext,
    useWatch
} from "react-hook-form";
import React, {useEffect, useMemo, useState} from "react";
import {useUpdateEffect} from "usehooks-ts";
import {isEmpty, padStart, range, set} from "lodash";
import {RHFMultiSelectField} from "../../../../../shared/components/Fields/RHFMultiSelectField";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import cronstrue from "cronstrue";
import {Field, SingleSelectField, SingleSelectOption} from "@dhis2/ui";

const daysOfWeek = [
    {
        label: i18n.t("Monday"),
        value: "mon"
    },
    {
        label: i18n.t("Tuesday"),
        value: "tue"
    },
    {
        label: i18n.t("Wednesday"),
        value: "wed"
    },
    {
        label: i18n.t("Thursday"),
        value: "thu"
    },
    {
        label: i18n.t("Friday"),
        value: "fri"
    },
    {
        label: i18n.t("Saturday"),
        value: "sat"
    },
    {
        label: i18n.t("Sunday"),
        value: "sun"
    }
];

const monthsOfYear = [
    {
        label: i18n.t("January"),
        value: "jan"
    },
    {
        label: i18n.t("February"),
        value: "feb"
    },
    {
        label: i18n.t("March"),
        value: "mar"
    },
    {
        label: i18n.t("April"),
        value: "apr"
    },
    {
        label: i18n.t("May"),
        value: "may"
    },
    {
        label: i18n.t("June"),
        value: "jun"
    },
    {
        label: i18n.t("July"),
        value: "jul"
    },
    {
        label: i18n.t("August"),
        value: "aug"
    },
    {
        label: i18n.t("September"),
        value: "sep"
    },
    {
        label: i18n.t("October"),
        value: "oct"
    },
    {
        label: i18n.t("November"),
        value: "nov"
    },
    {
        label: i18n.t("December"),
        value: "dec"
    }
];

const minuteConfig = {
    label: i18n.t("Minute"),
    min: 0,
    max: 59,
    initial: 0
};

const hourConfig = {
    label: i18n.t("Hour"),
    min: 0,
    max: 23,
    initial: 0
};
const weekDayConfig = {
    label: i18n.t("Day"),
    multiple: true,
    options: daysOfWeek,
    required: true
};

const monthDayConfig = {
    label: i18n.t("Day"),
    min: 1,
    max: 31,
    initial: 1
};

const fields = [
    {
        label: i18n.t("Hour"),
        id: "hour",
        conjunction: i18n.t("At"),
        fn: CronTime.everyHourAt,
        fields: [
            minuteConfig
        ] as any[]
    },
    {
        label: i18n.t("Day"),
        id: "day",
        fn: CronTime.everyDayAt,
        conjunction: i18n.t("At"),
        fields: [
            hourConfig,
            minuteConfig
        ] as any[]
    },
    {
        label: i18n.t("Week"),
        id: "week",
        fn: CronTime.everyWeekAt,
        conjunction: i18n.t("On"),
        fields: [
            weekDayConfig,
            hourConfig,
            minuteConfig
        ] as any[]
    },
    {
        label: i18n.t("Month"),
        id: "month",
        fn: CronTime.everyMonthOn,
        conjunction: i18n.t("On"),
        fields: [
            monthDayConfig,
            hourConfig,
            minuteConfig
        ]
    },
    {
        label: i18n.t("Year"),
        id: "year",
        fn: CronTime.everyYearIn,
        conjunction: i18n.t("On"),
        fields: [
            {
                label: i18n.t("Month"),
                required: true,
                multiple: true,
                options: monthsOfYear
            },
            monthDayConfig,
            hourConfig,
            minuteConfig
        ]
    }
];

function CustomSelector({type}: { type?: string | null }) {
    const {reset} = useFormContext();
    const selectedConfig = useMemo(() => {
        return fields.find(({id}) => id === type);
    }, [type]);

    useUpdateEffect(() => {
        if (selectedConfig) {
            const defaultValues = {};
            selectedConfig?.fields?.forEach(({initial}, index) => {
                set(defaultValues, index.toString(), initial);
            });
            reset(defaultValues);
        }
    }, [selectedConfig]);

    return (
        <>
            <span>{selectedConfig?.conjunction}</span>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                alignItems: "end"
            }} className="w-100">
                {
                    selectedConfig?.fields?.map(({options, min, max, label, multiple, required}, index) => {
                        if (!isEmpty(options)) {
                            if (multiple) {
                                return (
                                    <RHFMultiSelectField
                                        key={`${index}-${label}`}
                                        validations={{
                                            required: {
                                                value: required,
                                                message: i18n.t("This field is required")
                                            }
                                        }} required={required} name={index.toString()} label={label} options={options}/>
                                );
                            }
                            return (
                                <RHFSingleSelectField
                                    key={`${index}-${label}`}
                                    validations={{
                                        required: {
                                            value: required,
                                            message: i18n.t("This field is required")
                                        }
                                    }} required={required} label={label} fullWidth options={options}
                                    name={index.toString()}/>
                            );
                        }

                        const generatedOptions = range(min, max + 1).map((value) => ({
                            label: padStart(value.toString(), 2),
                            value: padStart(value.toString(), 2)
                        }));

                        return (
                            <RHFSingleSelectField
                                key={`${index}-${label}`}
                                validations={{required: {value: required, message: i18n.t("This field is required")}}}
                                required={required} label={label} fullWidth options={generatedOptions}
                                name={index.toString()}/>
                        );
                    })
                }
            </div>
        </>
    );
}


function Submitter({field, type}: { field: ControllerRenderProps<FieldValues, "cron">, type: string | null }) {
    const values = useWatch();
    useUpdateEffect(() => {
        if (!values) return;
        const config = fields.find((config) => config.id === type);
        if (config) {
            if (isEmpty(values)) return;
            const params: any = Object.values(values) as any[];
            if (config.fields.length === params.length) {
                const cron = config.fn(...params);
                field.onChange(cron);
            }
        }
    }, [values]);

    return null;
}

export function CustomCronInput() {
    const [type, setType] = useState<string | null>(null);
    const {field, fieldState} = useController({
        name: "cron"
    });
    const form = useForm();

    const mainOptions = fields.map(({id, label}) => ({label, value: id}));

    const text = useMemo(() => {
        const value = field.value;
        if (value) {
            try {
                return cronstrue.toString(value);
            } catch (e) {
                return "";
            }
        }
        return "";
    }, [field.value]);

    useEffect(() => {
        return () => {
            setType(null);
            form.reset();
        };
    }, []);


    return (
        <Field helpText={text} validationText={fieldState.error?.message} error={!!fieldState.error}>
            <FormProvider {...form}>
                <div className="column gap-16 w-100">
                    <Submitter type={type} field={field}/>
                    <div className="w-100">
                        <SingleSelectField selected={type}
                            onChange={({selected}: { selected: string }) => {
                                setType(selected);
                                field.onChange(null);
                            }}
                            label={i18n.t("Every")} options={mainOptions} name="type">
                            {
                                mainOptions.map((option) => (
                                    <SingleSelectOption key={`${option.value}-option`} {...option} />))
                            }
                        </SingleSelectField>
                    </div>
                    <CustomSelector type={type}/>
                </div>
            </FormProvider>
        </Field>
    );
}
