import {MultiSelectField, MultiSelectOption} from "@dhis2/ui";
import {find, intersectionWith, isEmpty} from "lodash";
import React, {useEffect, useMemo} from "react";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import {useGroups} from "./RHFGroupSelector";


function FieldControl({groups, name}: { groups: any; name: string }) {
    const {setValue} = useFormContext();
    const [selectedGroup, visualizations] = useWatch({
        name: ["group", "visualizations"]
    });

    const group = useMemo(() => {
        return find(groups, ["id", selectedGroup]);
    }, [groups, selectedGroup]);

    const options = useMemo(() => {
        if (!group) {
            return [];
        }
        return group?.visualizations?.map((vis: any) => ({label: vis.name, value: vis.id})) ?? [];
    }, [group]);

    useEffect(() => {
        const validValues = intersectionWith(visualizations, options, (vis: any, option: any) => {
            return vis.id === option.value;
        });

        if (isEmpty(validValues)) {
            //Requires a reset
            setValue(name, []);
        }
    }, [selectedGroup]);

    return null;
}

export function Field({field, fieldState, options, loading, required, label, group}: {
		label: string;
		field: any;
		fieldState: any,
		options: any;
		loading?: boolean;
		required?: boolean;
		group: any
}) {

    const groupChanged = isEmpty(intersectionWith(field.value, options, (vis: any, option: any) => {
        return vis.id === option.value;
    }));

    return (
        <MultiSelectField
            loading={loading}
            required={required}
            filterable
            label={label}
            onChange={({selected}: { selected: string[] }) => {
                field.onChange(selected?.map((sel) => {
                    const option = find(options, ["value", sel]);
                    return {
                        id: option.value,
                        name: option.label
                    };
                }));
            }}
            selected={groupChanged ? [] : field.value?.map(({id}: { id: string }) => id) ?? []}
            error={!!fieldState.error}
            validationText={fieldState.error?.message}
        >
            {
                options?.map(({label, value}: any) => (
                    <MultiSelectOption key={`${label}-${value}`} label={label} value={value}/>))
            }
        </MultiSelectField>
    );
}


export interface RHFVisSelectorProps {
		name: string;
		validations?: Record<string, any>;
		label: string;
		required?: boolean;
}

export function RHFVisSelector({validations, name, label, required}: RHFVisSelectorProps) {
    const {data: groups, loading} = useGroups();

    const [selectedGroup] = useWatch({
        name: ["group"]
    });

    const group = useMemo(() => {
        return find(groups, ["id", selectedGroup]);
    }, [groups, selectedGroup]);

    const options = useMemo(() => {
        if (!group) {
            return [];
        }
        return group?.visualizations?.map((vis: any) => ({label: vis.name, value: vis.id})) ?? [];
    }, [group]);


    return (
        <>
            <Controller
                rules={validations}
                render={
                    ({field, fieldState, formState,}) => {
                        return (
                            <Field
                                group={group}
                                options={options}
                                field={field}
                                fieldState={fieldState}
                                label={label}
                                required={required}
                                loading={loading}
                            />
                        );
                    }
                } name={name}/>
        </>
    );
}
