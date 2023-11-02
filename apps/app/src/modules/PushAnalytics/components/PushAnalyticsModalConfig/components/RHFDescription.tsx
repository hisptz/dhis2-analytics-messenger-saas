import i18n from "@dhis2/d2-i18n";
import {TextAreaField} from "@dhis2/ui";
import React from "react";
import {Controller} from "react-hook-form";

export interface RHFDescriptionProps {
		name: string;
		validations?: Record<string, any>;
		label: string;
		required?: boolean;
}

export function RHFDescription({validations, name, label, required}: RHFDescriptionProps) {

    return (
        <Controller
            rules={validations}
            render={
                ({field, fieldState, formState,}) => {

                    return (
                        <TextAreaField
                            name={name}
                            onChange={({value}: { value: string }) => field.onChange(value)}
                            required={required}
                            label={label}
                            value={field.value}
                            error={!!fieldState.error}
                            validationText={fieldState.error?.message}
                            helpText={i18n.t("You can use different formatting conventions as per the selected gateway. (E.g * to bold for whatsapp gateway)")}
                        />
                    );
                }
            } name={name}/>
    );
}
