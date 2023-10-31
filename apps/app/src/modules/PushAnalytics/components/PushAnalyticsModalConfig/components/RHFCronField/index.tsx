import i18n from "@dhis2/d2-i18n";
import {Field} from "@dhis2/ui";
import {Info} from "luxon";
import React from "react";
import {FormProvider, useController, useForm} from "react-hook-form";

export interface RHFCronFieldProps {
		name: string;
		validations?: Record<string, any>,
		required?: boolean,
		label?: string;
}

export const units = [
    {
        name: "minute",
        label: i18n.t("Minute"),
        sideLabel: ":",
        rank: 1,
        min: 0,
        max: 59
    },
    {
        name: "hour",
        label: i18n.t("Hour"),
        sideLabel: i18n.t("at"),
        rank: 2,
        min: 0,
        max: 23,
        enabled: true
    },
    {
        name: "day",
        label: i18n.t("Day"),
        sideLabel: i18n.t("on"),
        rank: 3,
        min: 1,
        max: 31,
        enabled: true

    },
    {
        name: "month",
        label: i18n.t("Month"),
        sideLabel: i18n.t("on"),
        rank: 4,
        enabled: true,
        options: Info.months("long"),
        min: 0,
        max: 11
    },
    {
        name: "dayOfWeek",
        label: i18n.t("Day of week"),
        sideLabel: i18n.t("on"),
        rank: 5,
        enabled: false,
        options: Info.weekdays("long"),
        min: 1,
        max: 7
    },
    {
        name: "year",
        label: i18n.t("Year"),
        sideLabel: i18n.t("on"),
        rank: 5,
        enabled: true,
        options: Info.weekdays("long"),
        min: 1970,
        max: 2099
    },

].reverse();


export function RHFCronField({name, label, required, validations}: RHFCronFieldProps) {
    const controller = useController({
        name,
        rules: validations
    });
    const form = useForm();


    return (
        <Field required={required} name={name} label={label}>
            <FormProvider {...form}>

            </FormProvider>
        </Field>
    );
}
