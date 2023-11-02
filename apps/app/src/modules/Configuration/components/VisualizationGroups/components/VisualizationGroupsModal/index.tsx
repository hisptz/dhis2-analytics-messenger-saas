import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import {isEmpty} from "lodash";
import React, {useCallback} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useRecoilValue, useResetRecoilState} from "recoil";
import {VisualizationGroup} from "../../schema";
import {RHFVisualizationSelector} from "./Components/RHFVisualizationSelector";
import {useSaveVisualizationGroup, VisGroupUpdateState} from "./hooks/save";


export interface VisualizationGroupsModalProps {
		onClose: () => void,
		hidden: boolean;
}

export function VisualizationGroupsModal({onClose, hidden}: VisualizationGroupsModalProps) {
    const group = useRecoilValue(VisGroupUpdateState);
    const resetGroupUpdate = useResetRecoilState(VisGroupUpdateState);
    const form = useForm<VisualizationGroup>({
        defaultValues: group || {},
        shouldFocusError: false
    });

    const {save, updating, creating} = useSaveVisualizationGroup();
    const onCloseClick = useCallback(
        () => {
            form.reset({});
            resetGroupUpdate();
            onClose();
        },
        [onClose],
    );

    const onSubmit = useCallback(
        async (data: VisualizationGroup) => {
            await save(data);
            onCloseClick();
        },
        [onCloseClick],
    );


    return (
        <Modal position="middle" hide={hidden} onClose={onCloseClick}>
            <ModalTitle>
                {i18n.t("{{operation}} group", {
                    operation: group ? i18n.t("Update") : i18n.t("Add")
                })}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <div className="column gap-16">
                        <RHFTextInputField label={i18n.t("Name")} name="name" required
																					 validations={{required: i18n.t("Name is required")}}/>
                        <RHFVisualizationSelector
                            required
                            name={"visualizations"}
                            validations={{
                                validate: (value: string[]) => {
                                    return !isEmpty(value) || i18n.t("Select at least one visualization");
                                }
                            }}
                            label={i18n.t("Visualizations")}/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <Button loading={creating || updating} onClick={form.handleSubmit(onSubmit)}
                        primary>{group ? updating ? i18n.t("Updating...") : i18n.t("Update") : creating ? i18n.t("Saving...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
