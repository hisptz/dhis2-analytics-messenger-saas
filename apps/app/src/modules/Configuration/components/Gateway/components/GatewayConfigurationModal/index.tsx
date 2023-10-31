import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import React, {useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useRecoilValue, useResetRecoilState} from "recoil";
import {Gateway} from "../../schema";
import {GatewayUpdateState, useSaveGateway} from "./hooks/save";
import {useQueryClient} from "@tanstack/react-query";
import {useGateways} from "../../hooks/data";


export interface GatewayConfigurationModalProps {
		onClose: () => void,
		hidden: boolean;
}

export function GatewayConfigurationModal({onClose, hidden}: GatewayConfigurationModalProps) {
    const {refetch} = useGateways();
    const statusClient = useQueryClient();
    const resetConfig = useResetRecoilState(GatewayUpdateState);
    const config = useRecoilValue(GatewayUpdateState);
    const form = useForm<Gateway>({
        defaultValues: config || {}
    });
    const {save, creating, updating} = useSaveGateway();

    const onCloseClick = useCallback(
        () => {
            resetConfig();
            form.reset({});
            onClose();
        },
        [onClose, form.reset],
    );

    const onSubmit = useCallback(
        async (data: Gateway) => {
            await save(data);
            refetch();
            statusClient.invalidateQueries([data.id]);
            onCloseClick();
        },
        [onCloseClick],
    );

    useEffect(() => {
        if (config) {
            form.reset(config);
        }
    }, [config, form.reset]);


    return (
        <Modal position="middle" hide={hidden} onClose={onCloseClick}>
            <ModalTitle>
                {i18n.t("{{operation}} gateway", {
                    operation: config ? i18n.t("Update") : i18n.t("Add")
                })}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <div className="column gap-16">
                        <RHFTextInputField label={i18n.t("Name")} name="name" required
																					 validations={{required: i18n.t("Name is required")}}/>
                        <RHFTextInputField label={i18n.t("URL")} type="url" name="url" required
																					 validations={{required: i18n.t("Whatsapp URL is required")}}/>
                        <RHFTextInputField label={i18n.t("API Key")} type="url" name="apiKey" required
																					 validations={{required: i18n.t("API key is required")}}/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <Button loading={updating || creating} onClick={form.handleSubmit(onSubmit)}
                        primary>{config ? updating ? i18n.t("Updating...") : i18n.t("Update") : creating ? i18n.t("Saving...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
