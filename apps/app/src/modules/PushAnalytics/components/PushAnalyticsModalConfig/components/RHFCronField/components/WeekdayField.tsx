import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {Info} from "luxon";
import React, {useMemo} from "react";

export function WeekdayField() {
    const options = useMemo(() => Info.weekday("long").map((option: string, index: number) => ({
        label: option,
        value: index.toString()
    })), []);

    return (
        <RHFSingleSelectField options={options} name={"2"}/>
    );
}
