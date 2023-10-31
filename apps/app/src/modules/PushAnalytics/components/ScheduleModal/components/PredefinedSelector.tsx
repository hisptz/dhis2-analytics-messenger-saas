import {useSetting} from "@dhis2/app-service-datastore";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import cronstrue from "cronstrue";


export function PredefinedSelector() {
    const [predefinedSchedules] = useSetting("predefinedSchedules", {global: true});


    const options = predefinedSchedules?.map((schedule: { value: string }) => {
        return {
            label: cronstrue.toString(schedule.value),
            value: schedule.value
        };
    }) ?? [];

    return (
        <RHFSingleSelectField
            required
            validations={{required: i18n.t("This field is required")}}
            label={i18n.t("Select time")}
            options={options}
            name={"cron"}
        />
    );

}
