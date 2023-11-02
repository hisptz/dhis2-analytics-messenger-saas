import React, {useCallback, useMemo} from "react";
import i18n from "@dhis2/d2-i18n";
import {Column} from "../../../../../../shared/interfaces";
import CustomTable from "../../../../../../shared/components/CustomTable";
import {useGateways} from "../../hooks/data";
import {ActionButton} from "../../../../../../shared/components/CustomDataTable/components/ActionButton";
import {Button, IconAdd16, IconDelete24, IconEdit24} from "@dhis2/ui";
import {useConfirmDialog} from "@hisptz/dhis2-ui";
import {useSetRecoilState} from "recoil";
import {GatewayUpdateState} from "../GatewayConfigurationModal/hooks/save";
import {useBoolean} from "usehooks-ts";
import {GatewayConfigurationModal} from "../GatewayConfigurationModal";
import FullPageLoader from "../../../../../../shared/components/Loaders";
import {StatusIndicator} from "./components/StatusIndicator";

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
        label: i18n.t("Status"),
        key: "status"
    },
    {
        label: i18n.t("Actions"),
        key: "actions",
    },
];

export default function GatewayConfigurationsTable(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true);
    const {gateways, loading, error, refetch, deleteGateway} = useGateways();
    const setGatewayUpdate = useSetRecoilState(GatewayUpdateState);
    const {confirm} = useConfirmDialog();

    const rows = useMemo(() => {
        return gateways.map((value, index) => {
            return {
                index: index + 1,
                ...value,
                status: <StatusIndicator value={value}/>,
                actions: <ActionButton
                    actions={[
                        {
                            key: "edit-config",
                            label: i18n.t("Edit"),
                            icon: <IconEdit24/>,
                            onClick: () => {
                                setGatewayUpdate(value);
                                open();
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
                                    message: i18n.t("Are you sure you want to delete the gateway {{name}}?", {
                                        name: value.name
                                    }),
                                    onCancel: () => {
                                    },
                                    onConfirm: async () => {
                                        await deleteGateway({
                                            id: value.key
                                        });
                                        await refetch();
                                    }
                                });
                            }
                        },
                    ]} row={value}/>
            };
        });
    }, [gateways]);


    const onClose = useCallback(
        () => {
            refetch();
            hide();
        },
        [],
    );

    return (
        <div className="column gap-16">
            <div>
                <Button
                    primary
                    name="Gateway"
                    onClick={open}
                    value="gatewayButton"
                    icon={<IconAdd16/>}
                >
                    {i18n.t("Add gateway")}
                </Button>
            </div>
            {
                !hidden && (<GatewayConfigurationModal onClose={onClose} hidden={hidden}/>)
            }
            {
                loading && (<FullPageLoader/>)
            }
            {
                !loading && (<CustomTable
                    loading={loading}
                    columns={tableColumns}
                    data={rows}
                    pagination={undefined}
                    emptyTableMessage={i18n.t(
                        "There are no gateway configurations, click the above button to add new configurations."
                    )}
                />)
            }
        </div>
    );
}
