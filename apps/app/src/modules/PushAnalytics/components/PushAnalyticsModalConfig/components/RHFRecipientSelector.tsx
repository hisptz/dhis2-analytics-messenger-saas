import i18n from "@dhis2/d2-i18n";
import {Button, Field} from "@dhis2/ui";
import {RHFSingleSelectField, RHFTextInputField} from "@hisptz/dhis2-ui";
import {filter, uniqBy} from "lodash";
import React, {useCallback} from "react";
import {Controller, FormProvider, useForm, useWatch} from "react-hook-form";
import {useUpdateEffect} from "usehooks-ts";
import {ContactChip} from "../../../../../shared/components/ContactChip";
import {useDHIS2Users} from "../../../../../shared/hooks/users";
import {useWhatsappData} from "../../../../../shared/hooks/whatsapp";
import {Contact} from "../../../../../shared/interfaces";

export interface RHFRecipientSelectorProps {
		name: string;
		validations?: Record<string, any>;
		label: string;
		required?: boolean;
}

function AddRecipient({onChange}: {
		loading?: boolean;
		onChange: (recipient: Contact) => void,
}) {
    const gateway = useWatch({
        name: "gateway"
    });
    const {groups, loading} = useWhatsappData(gateway);
    const {users, loading: usersLoading} = useDHIS2Users();
    const form = useForm<Omit<Contact, "type"> & { type: "user" | "individual" | "group" }>({
        defaultValues: {
            type: "individual"
        },
        reValidateMode: "onBlur",
        mode: "onBlur",
        shouldFocusError: false
    });

    const [type] = form.watch(["type"]);

    const onSubmit = useCallback(
        (data: Omit<Contact, "type"> & { type: "user" | "individual" | "group" }) => {
            onChange({
                ...data,
                type: data.type === "user" ? "individual" : data.type as "group" | "individual",
            });
            form.reset({});
        },
        [form, onChange],
    );

    useUpdateEffect(() => {
        form.unregister("number");
        form.clearErrors("number");
        form.resetField("number");
    }, [type]);

    return (
        <Field
            label={i18n.t("Add new recipient")}
            helpText={type === "individual" ? i18n.t("Start with country code without the + sign. Example 255XXXXXXXXX") : type === "user" && (i18n.t("Only users with whatsApp contacts will be listed"))}
        >
            <div style={{display: "grid", gridTemplateColumns: "2fr 3fr 1fr", gap: 16, alignItems: "end"}}>
                <FormProvider {...form}>
                    <RHFSingleSelectField
                        label={i18n.t("Type")}
                        options={[
                            {
                                label: i18n.t("Group"),
                                value: "group"
                            },
                            {
                                label: i18n.t("Phone Number"),
                                value: "individual"
                            },
                            {
                                label: i18n.t("Users"),
                                value: "user"
                            }
                        ]}
                        name={"type"}
                    />
                    {
                        type === "group" &&
                        <RHFSingleSelectField
                            loading={loading} label={i18n.t("Group")}
                            options={groups.map((group: any) => ({
                                value: group.id,
                                label: group.name
                            }))}
                            name={"number"}/>
                    }
                    {
                        type === "user" &&
                        <RHFSingleSelectField
                            loading={usersLoading}
                            label={i18n.t("User")}
                            options={users.map((user: any) => ({
                                value: user.whatsApp,
                                label: user.displayName
                            }))}
                            name={"number"}/>
                    }
                    {
                        type === "individual" && (<RHFTextInputField
                            placeholder={"255XXXXXXXXX"}
                            validations={{
                                pattern: {
                                    value: /^\d{1,3}\d{9}$/,
                                    message: i18n.t("Invalid phone number")
                                }
                            }} label={i18n.t("Number")} name={"number"}/>)
                    }
                    <Button onClick={form.handleSubmit(onSubmit)}>
                        {i18n.t("Add")}
                    </Button>
                </FormProvider>
            </div>
        </Field>
    );
}


export function RHFRecipientSelector({validations, name, label, required}: RHFRecipientSelectorProps) {
    const gateway = useWatch({
        name: "gateway"
    });
    return (
        <Controller
            rules={validations}
            render={({field}) => {
                const recipients = field.value ?? [];
                return (
                    <Field required={required} label={label}>
                        <div className="column gap-16">
                            <div style={{flexWrap: "wrap", gap: 8}} className="row">
                                {
                                    recipients.map(({number, type}: Contact) => (
                                        <ContactChip gatewayId={gateway} key={`${number}-recipient`} onRemove={() => {
                                            field.onChange(filter(recipients, (recipient) => number !== recipient.number));
                                        }} number={number} type={type}/>))
                                }
                            </div>
                            <AddRecipient onChange={(contact) => {
                                field.onChange(uniqBy([
                                    ...recipients,
                                    contact
                                ], "number"));
                            }}/>
                        </div>
                    </Field>
                );
            }}
            name={name}
        />
    );
}

