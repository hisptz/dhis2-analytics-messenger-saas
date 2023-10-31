import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {Button, IconAdd24, IconClockHistory24, IconDelete24, IconEdit24, IconMessages24} from "@dhis2/ui";
import {useConfirmDialog} from "@hisptz/dhis2-ui";
import {find, isEmpty} from "lodash";
import React, {useCallback, useMemo, useState} from "react";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {useBoolean} from "usehooks-ts";
import {ActionButton} from "../../../../shared/components/CustomDataTable/components/ActionButton";
import CustomTable from "../../../../shared/components/CustomTable";
import {PUSH_ANALYTICS_DATASTORE_KEY} from "../../../../shared/constants/dataStore";
import {Column, Contact, PushAnalytics} from "../../../../shared/interfaces";
import {useGateways} from "../../../Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../../Configuration/components/Gateway/schema";
import EmptyPushAnalyticsList from "../EmptyPushAnalyticsList";
import {PushAnalyticsModalConfig} from "../PushAnalyticsModalConfig";
import FullPageLoader from "../../../../shared/components/Loaders";
import {useManageConfig} from "../PushAnalyticsModalConfig/hooks/save";
import {useSendAnalytics} from "../PushAnalyticsModalConfig/hooks/send";
import {ContactChip, ContactName} from "../../../../shared/components/ContactChip";
import {useDHIS2Users} from "../../../../shared/hooks/users";
import {ScheduleModal} from "../ScheduleModal";

const tableColumns: Column[] = [
    {
        label: i18n.t("S/N"),
        key: "index",
    },
    {
        label: i18n.t("Name"),
        key: "name",
    },
    {
        label: i18n.t("Gateway"),
        key: "gateway",
    },
    {
        label: i18n.t("Recipients"),
        key: "contacts",
    },
    {
        label: i18n.t("Actions"),
        key: "actions",
    },
];
const pushAnalyticsConfigQuery = {
    config: {
        resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
        params: {
            fields: [
                "id",
                "name",
                "gateway",
                "contacts",
                "group",
                "visualizations",
                "description"
            ]
        }
    }
};

export const ConfigUpdateState = atom<PushAnalytics | null>({
    key: "config-update-state",
    default: null
});

function usePushAnalyticsConfig({onEdit}: { onEdit: () => void }) {
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [scheduleConfig, setScheduleConfig] = useState<PushAnalytics | null>(null);

    const setUpdateConfig = useSetRecoilState(ConfigUpdateState);
    const {data, loading, refetch} = useDataQuery<{
        config: { entries: Array<PushAnalytics & { key: string }> }
    }>(pushAnalyticsConfigQuery);

    const {loading: usersLoading} = useDHIS2Users();

    const {confirm} = useConfirmDialog();
    const {send,} = useSendAnalytics();

    const {deleteConfig} = useManageConfig("");

    const {gateways, loading: loadingGateways} = useGateways();
    const configs = useMemo(() => {
        return data?.config?.entries?.map((config, index) => {
            const gateway = find((gateways as Gateway[]), ["id", config.gateway]);
            const contacts = config?.contacts;


            return {
                ...config,
                index: index + 1,
                gateway: gateway?.name,
                contacts: <div style={{gap: 8, flexWrap: "wrap"}} className="row">
                    {
                        contacts?.map(({number, type}: Contact) => (
                            <ContactChip gatewayId={gateway?.id as string} key={`${number}-recipient`} number={number}
																				 type={type}/>))
                    }
                </div>,
                actions: <ActionButton actions={[
                    {
                        key: "edit-config",
                        label: i18n.t("Edit"),
                        icon: <IconEdit24/>,
                        onClick: () => {
                            setUpdateConfig(config);
                            onEdit();
                        }
                    },
                    {
                        key: "edit-config",
                        label: i18n.t("Schedule"),
                        icon: <IconClockHistory24/>,
                        onClick: () => {
                            setScheduleConfig(config);
                        }
                    },
                    {
                        key: "delete-config",
                        label: i18n.t("Delete"),
                        icon: <IconDelete24/>,
                        onClick: () => {
                            confirm({
                                loadingText: i18n.t("Deleting..."),
                                confirmButtonText: i18n.t("Delete"),
                                title: i18n.t("Confirm delete"),
                                message: i18n.t("Are you sure you want to delete the configuration {{name}}?", {
                                    name: config.name
                                }),
                                onCancel: () => {
                                },
                                onConfirm: async () => {
                                    await deleteConfig(config);
                                    await refetch();
                                }
                            });
                        }
                    },
                    {
                        key: "send-messages",
                        label: i18n.t("Send"),
                        icon: <IconMessages24/>,
                        onClick: () => {
                            confirm({
                                confirmButtonColor: "primary",
                                loadingText: i18n.t("Sending..."),
                                confirmButtonText: i18n.t("Send"),
                                title: i18n.t("Confirm sending"),
                                message: <>{i18n.t("Sending visualizations to")}:
                                    <ul>
                                        {contacts?.map(({
                                            number,
                                            type
                                        }) => <li
                                            key={`${number}-list`}>
                                            <ContactName
                                                type={type}
                                                number={number}
                                                gatewayId={gateway?.id as string}
                                            />
                                        </li>)}
                                    </ul>
                                </>,
                                onCancel: () => {
                                },
                                onConfirm: async () => {
                                    await send(config);
                                }
                            });
                        }
                    },
                ]} row={config}/>
            };
        });
    }, [data, gateways]);

    return {
        data: configs,
        scheduleConfig,
        setScheduleConfig,
        loading: loadingGateways || loading || usersLoading,
        refetch
    };
}

export default function PushAnalyticsTable(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true);
    const {data, loading, refetch, scheduleConfig, setScheduleConfig} = usePushAnalyticsConfig({onEdit: open});
    const configUpdate = useRecoilValue(ConfigUpdateState);

    const onClose = useCallback(() => {
        hide();
        refetch();
    }, []);

    if (loading) {
        return (<FullPageLoader/>);
    }

    return (
        <>
            {
                scheduleConfig && (
                    <ScheduleModal config={scheduleConfig} hide={!scheduleConfig} onClose={() => setScheduleConfig(null)}/>)
            }
            {
                !hidden && (<PushAnalyticsModalConfig config={configUpdate} hidden={hidden} onClose={onClose}/>)
            }
            {isEmpty(data) ? <EmptyPushAnalyticsList anAddPushAnalytics={open}/> :
                <div className="column gap-16" style={{width: "100%"}}>
                    <div>
                        <Button onClick={open} primary
                            icon={<IconAdd24/>}>{i18n.t("Add push analytics configuration")}</Button>
                    </div>
                    <CustomTable columns={tableColumns} data={data as any} pagination={undefined}/>
                </div>}

        </>
    );
}
