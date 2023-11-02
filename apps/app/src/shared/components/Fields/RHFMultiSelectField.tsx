import {Controller} from "react-hook-form";
import {MultiSelectField, MultiSelectOption} from "@dhis2/ui";
import React from "react";


export interface RHFMultiSelectFieldProps {
    validations?: Record<string, any>
    name: string;
    label: string;
    options: any[];

    [x: string]: any;
}


export function RHFMultiSelectField({name, label, options, ...props}: RHFMultiSelectFieldProps) {


    return (
        <Controller
            render={({field, fieldState}) => {
                return (
                    <MultiSelectField
                        {...props}
                        filterable
                        label={label}
                        onChange={({selected}: { selected: string[] }) => {
                            field.onChange(selected?.map((sel) => {
                                return sel;
                            }));
                        }}
                        selected={Array.isArray(field.value) ? field.value ?? [] : []}
                        error={!!fieldState.error}
                        validationText={fieldState.error?.message}
                    >
                        {
                            options?.map(({label, value}: any) => (
                                <MultiSelectOption key={`${label}-${value}`} label={label} value={value}/>))
                        }
                    </MultiSelectField>
                );
            }} name={name}
        />
    );

}
