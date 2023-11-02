import i18n from "@dhis2/d2-i18n";
import {
    Button,
    ButtonStrip,
    FlyoutMenu,
    MenuItem,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SplitButton
} from "@dhis2/ui";
import {RHFTextInputField, useConfirmDialog} from "@hisptz/dhis2-ui";
import {uid} from "@hisptz/dhis2-utils";
import React, {useCallback, useEffect, useMemo} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useRecoilValue, useResetRecoilState} from "recoil";
import {PushAnalytics} from "../../../../shared/interfaces";
import {ConfigUpdateState} from "../PushAnalyticsTable";
import {RHFDescription} from "./components/RHFDescription";
import {RHFGatewaySelector} from "./components/RHFGatewaySelector";
import {RHFGroupSelector} from "./components/RHFGroupSelector";
import {RHFRecipientSelector} from "./components/RHFRecipientSelector";
import {RHFVisSelector} from "./components/RHFVisSelector";
import {useManageConfig} from "./hooks/save";
import {useSendAnalytics} from "./hooks/send";

export interface PushAnalyticsModalConfigProps {
		config?: PushAnalytics | null,
		hidden: boolean;
		onClose: () => void
}

function SendActions({actions}: { actions: { label: string; action: () => void }[] }) {

    return (
        <FlyoutMenu>
            {
                actions.map(({label, action}) => (
                    <MenuItem key={`${label}-menu-item`} label={label} onClick={action}/>))
            }
        </FlyoutMenu>
    );
}

function getButtonLabel(creating: boolean, updating: boolean, sending: boolean, config?: PushAnalytics | null) {
    if (config) {
        if (updating) {
            return i18n.t("Updating...");
        }
        if (sending) {
            return i18n.t("Sending...");
        }
        return i18n.t("Update and send");
    } else {
        if (creating) {
            return i18n.t("Saving...");
        }
        if (sending) {
            return i18n.t("Sending...");
        }
        return i18n.t("Save and send");
    }
}

export function PushAnalyticsModalConfig({hidden, onClose}: PushAnalyticsModalConfigProps) {
    const id = useMemo(() => uid(), []);
    const config = useRecoilValue(ConfigUpdateState);
    const resetConfigUpdate = useResetRecoilState(ConfigUpdateState);
    const {confirm} = useConfirmDialog();
    const form = useForm<PushAnalytics>({
        defaultValues: config || {},
        shouldFocusError: false,
    });
    const {send, loading: sending} = useSendAnalytics();
    const onCloseClick = useCallback(
        (fromSave?: boolean) => {
            if (!fromSave && form.formState.isDirty) {
                confirm({
                    message: i18n.t("Are you sure you want to close the form? All changes will be lost."),
                    title: i18n.t("Confirm close"),
                    confirmButtonColor: "primary",
                    confirmButtonText: i18n.t("Close"),
                    onCancel: () => {
                    },
                    onConfirm: () => {
                        resetConfigUpdate();
                        form.reset({});
                        onClose();
                    }
                });
            } else {
                resetConfigUpdate();
                form.reset({});
                onClose();
            }
        },
        [onClose],
    );
    const {save, creating, updating} = useManageConfig(id, config);

    const onSaveAndSend = useCallback(
        (shouldSend: boolean) => async (data: PushAnalytics) => {
            const sanitizedData = {
                ...data,
                id: config?.id ?? id,
                contacts: data.contacts.map((contact) => ({...contact, id: contact.id ?? uid()}))
            };
            const success = await save(sanitizedData);
            if (success) {
                if (shouldSend) {
                    console.log({
                        sanitizedData
                    });
                    await send(sanitizedData);
                }
                onCloseClick(true);
            }
        },
        [send, id],
    );

    useEffect(() => {
        if (config) {
            form.reset(config);
        }

        return () => {
            form.reset({});
        };
    }, [config]);


    return (
        <Modal large position="middle" hide={hidden} onClose={onCloseClick}>
            <ModalTitle>
                {i18n.t("Send push analytics")}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <div className="column gap-16">
                        <RHFTextInputField
                            required validations={{required: i18n.t("Name is required")}} name="name"
                            label={i18n.t("Name")}/>
                        <RHFGatewaySelector
                            required validations={{required: i18n.t("Gateway is required")}}
                            name="gateway"
                            label={i18n.t("Gateway")}
                        />

                        <RHFGroupSelector required validations={{required: i18n.t("Group is required")}}
                            name="group"
                            label={i18n.t("Visualization group")}/>
                        <RHFVisSelector required
                            validations={{required: i18n.t("At least one visualization is required")}}
                            name="visualizations"
                            label={i18n.t("Visualizations")}/>
                        <RHFDescription required validations={{required: i18n.t("Description is required")}}
                            label={i18n.t("Description")} name="description"/>
                        <RHFRecipientSelector label={i18n.t("Recipients")} name="contacts"/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <SplitButton component={<SendActions actions={[
                        {
                            label: config ? i18n.t("Update and send") : i18n.t("Save and send"),
                            action: form.handleSubmit(onSaveAndSend(true))
                        },
                        {
                            label: config ? i18n.t("Update") : i18n.t("Save"),
                            action: form.handleSubmit(onSaveAndSend(false))
                        }
                    ]}/>}
                    disabled={creating || updating || sending}
                    loading={sending || creating || updating}
                    onClick={form.handleSubmit(onSaveAndSend(true))}
																 primary>{getButtonLabel(creating, updating, sending, config)}</SplitButton>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
