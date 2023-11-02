import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, SegmentedControl} from "@dhis2/ui";
import {FormProvider, useForm} from "react-hook-form";
import React, {useState} from "react";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {PushSchedule, useManagePushSchedule} from "../hooks/schedule";
import {PredefinedSelector} from "./PredefinedSelector";
import {CustomCronInput} from "./CustomCronInput";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {CronInput} from "./CronInput";
import cronstrue from "cronstrue";

export interface ScheduleFormModalProps {
    onClose: () => void;
    hide: boolean;
    config: PushAnalytics,
    defaultValue?: PushSchedule;
}

const cronSchema = z.object({
    cron: z.string({required_error: i18n.t("Cron is required")}).refine((value) => {

        if (!value) return false;

        let isValid = true;
        try {
            cronstrue.toString(value);
        } catch (e) {
            isValid = false;
        }
        return isValid;
    }, i18n.t("Invalid cron expression"))
});
export function ScheduleFormModal({onClose, hide, config, defaultValue}: ScheduleFormModalProps) {
    const form = useForm<{ cron: string }>({
        shouldFocusError: false,
        resolver: zodResolver(cronSchema),
    });
    const [type, setType] = useState("predefined");

    const onCloseClick = () => {
        setType("predefined");
        form.reset();
        onClose();
    };
    const {onAdd, saving} = useManagePushSchedule(config, defaultValue, onCloseClick);
    const onSubmit = (data: { cron: string }) => {
        onAdd(data);
    };


    return (
        <Modal position="middle" hide={hide} onClose={onCloseClick}>
            <ModalTitle>{i18n.t("Add new schedule")}</ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <div style={{minHeight: 200}} className="column gap-16">
                        {i18n.t("Scheduling to send")}<b>{config.name}</b>
                        <SegmentedControl
                            selected={type}
                            onChange={({value}: { value: string }) => {
                                form.reset();
                                setType(value);

                            }}
                            options={[
                                {label: i18n.t("Predefined"), value: "predefined"},
                                {label: i18n.t("Custom"), value: "custom"},
                                {label: i18n.t("Cron"), value: "cron"},
                            ]}
                        />

                        {
                            type === "predefined" && <PredefinedSelector/>
                        }
                        {
                            type === "custom" && <CustomCronInput/>
                        }
                        {
                            type === "cron" && <CronInput/>
                        }
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} loading={saving}
                        primary>{saving ? i18n.t("Adding...") : i18n.t("Add")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
