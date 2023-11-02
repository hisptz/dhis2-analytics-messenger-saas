import i18n from "@dhis2/d2-i18n";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import React, {useMemo} from "react";
import {useWatch} from "react-hook-form";
import cronstrue from "cronstrue";


export function CronInput() {
    const cron = useWatch({
        name: "cron"
    });

    const text = useMemo(() => {
        if (!cron) return "";
        try {
            return cronstrue.toString(cron);
        } catch (e) {
            return "";
        }
    }, [cron]);


    return (
        <RHFTextInputField helpText={text} required name="cron" label={i18n.t("Cron expression")}/>
    );
}
