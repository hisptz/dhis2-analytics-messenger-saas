import {RHFSingleSelectField, RHFTextInputField} from "@hisptz/dhis2-ui";
import {range} from "lodash";
import React from "react";


export interface CronValueFieldProps {
    rank: number
    label: string
    sideLabel?: string
    options?: string[]
    min?: number
    max?: number,
    index: number
}

export function CronValueField({rank, label, index, sideLabel, options, min, max}: CronValueFieldProps) {

    options ??= range(min ?? 0, (max ?? 10) + 1).map((option: number) => String(option));

    if (options) {
        return (
            <div className="gap-8 row align-end w-100">
                {index !== 0 && sideLabel}
                <div style={{flexGrow: 1}}>
                    <RHFSingleSelectField label={label} name={rank.toString()}
                        options={options?.map((option: string, index: number) => ({
                            label: option,
                            value: index.toString()
                        }))}
                        type="number"/>
                </div>
            </div>
        );
    }

    return (
        <div className="gap-8 row align-end">
            {sideLabel}
            <RHFTextInputField label={label} name={rank.toString()} min={min} max={max}
															 type="number"/>
        </div>
    );
}
