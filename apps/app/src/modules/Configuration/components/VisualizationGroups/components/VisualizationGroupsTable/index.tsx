import i18n from "@dhis2/d2-i18n";
import {Button, IconAdd16} from "@dhis2/ui";
import {CustomDataTable} from "@hisptz/dhis2-ui";
import React, {useCallback} from "react";
import {useBoolean} from "usehooks-ts";
import FullPageLoader from "../../../../../../shared/components/Loaders";
import {Column,} from "../../../../../../shared/interfaces";
import {useVisualizationGroups} from "../../hooks";
import {VisualizationGroupsModal} from "../VisualizationGroupsModal";

const tableColumns: Column[] = [
    {
        label: i18n.t("S/N"),
        key: "index",
    },
    {
        label: i18n.t("Group name"),
        key: "name",
    },
    {
        label: i18n.t("Visualizations"),
        key: "visualizations",
    },
    {
        label: i18n.t("Actions"),
        key: "action",
    },
];

export default function VisualizationGroupsTable(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true);
    const {visualizationGroups, loading, error, refetch, pager} =
				useVisualizationGroups(open);

    const onCloseClick = useCallback(
        () => {
            hide();
            refetch();
        },
        [hide, refetch],
    );


    return (
        <div style={{width: "100%"}}>
            {
                !hidden && (<VisualizationGroupsModal onClose={onCloseClick} hidden={hidden}/>)
            }
            <p className="sub-module-title">{i18n.t("Visualization groups")}</p>
            <p className="sub-module-subtitle">
                {i18n.t(
                    "Configuration of the visualization groups for push analytics and chat bot"
                )}
            </p>
            <div className="column gap-16">
                <div className="pt-16">
                    <Button
                        primary
                        name="Visualization group"
                        onClick={open}
                        value="visualizationGroupButton"
                        icon={<IconAdd16/>}
                    >
                        {i18n.t("Add visualization group")}
                    </Button>
                </div>
                {
                    loading ? (<FullPageLoader/>) : <CustomDataTable
                        columns={tableColumns}
                        loading={loading}
                        rows={visualizationGroups as any}
                        pagination={undefined}
                    />
                }
            </div>
        </div>
    );
}
