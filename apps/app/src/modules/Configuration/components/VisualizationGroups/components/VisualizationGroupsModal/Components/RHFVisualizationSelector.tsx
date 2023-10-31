import {useDataQuery} from "@dhis2/app-runtime";
import {Field, Transfer} from "@dhis2/ui";
import {debounce, find, uniqBy} from "lodash";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Controller} from "react-hook-form";

export interface RHFVisualizationSelectorProps {
		name: string;
		validations: Record<string, any>;
		label: string;
		required?: boolean
}


const visualizationQuery = {
    vis: {
        resource: "visualizations",
        params: ({page, keyword}: any) => {
            return {
                fields: ["id", "displayName"],
                page,
                pageSize: 50,
                totalPages: true,
                filter: keyword ? [
                    `identifiableToken:like:${keyword}`,
                ] : undefined
            };
        }
    }
};

export function RHFVisualizationSelector({name, label, validations, required}: RHFVisualizationSelectorProps) {
    const [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);
    const {data, loading, refetch} = useDataQuery<{
        vis: { pager: any; visualizations: any[] }
    }>(visualizationQuery, {
        variables: {
            page: 1
        }
    });

    useEffect(() => {
        if (data) {
            const newData: any[] = data?.vis?.visualizations?.map((visualization: any) => {
                return {
                    label: visualization.displayName,
                    value: visualization.id
                };
            });
            setOptions(prevState => (uniqBy([
                ...prevState,
                ...newData
            ], "value")));
        }
    }, [data]);

    const onNextPage = useCallback(() => {
        const page = parseInt(data?.vis?.pager?.page);
        const totalPages = parseInt(data?.vis?.pager?.pageCount);
        if (page !== totalPages) {
            refetch({
                page: parseInt(data?.vis?.pager?.page) + 1
            });
        }
    }, [refetch, data]);


    const onFilter = useCallback(
        (keyword: string) => {
            refetch({
                keyword,
                page: 1
            });
        },
        [refetch],
    );

    //TODO: Implement this on the filter
    const onFilterChange = useRef(debounce(onFilter, 1000));

    return (
        <Controller
            rules={validations}
            render={
                ({field, fieldState}) => {

                    const updatedOptions = useMemo(() => {
                        return uniqBy([
                            ...(options ?? []),
                            ...(field.value?.map(({id, name}: any) => ({label: name, value: id})) ?? [])
                        ], "value");
                    }, [options]);

                    return (<Field required={required} label={label}>
                        <Transfer
                            onEndReached={onNextPage}
                            filterable
                            loading={loading}
                            options={updatedOptions}
                            selected={field?.value?.map(({id}: { id: string }) => id) ?? []}
                            onChange={({selected}: { selected: string[] }) => {
                                field.onChange(selected?.map((value) => ({
                                    id: value,
                                    name: find(updatedOptions, ["value", value])?.label
                                })));
                            }}
                        />
                    </Field>);
                }
            }
            name={name}/>
    );
}
