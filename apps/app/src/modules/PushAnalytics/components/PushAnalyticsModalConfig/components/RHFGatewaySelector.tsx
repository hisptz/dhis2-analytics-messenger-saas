import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import React, {useMemo} from "react";
import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../../../Configuration/components/Gateway/schema";

export interface RHFGatewaySelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}


export function RHFGatewaySelector({validations, name, label, required}: RHFGatewaySelectorProps) {
    const {gateways, loading} = useGateways();

    const options = useMemo(() => {
        return (gateways as Gateway[]).map((value: any) => ({
            label: value.name,
            value: value.id
        }));
    }, [gateways]);

    return (
        <RHFSingleSelectField
            loading={loading}
            required={required}
            validations={validations}
            label={label}
            options={options}
            name={name}
        />
    );
}
