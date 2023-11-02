import {useAlert, useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {Tag} from "@dhis2/ui";
import {useConfirmDialog} from "@hisptz/dhis2-ui";
import React from "react";
import {useSetRecoilState} from "recoil";
import {ActionButton} from "../../../../../shared/components/CustomDataTable/components/ActionButton";
import {ANALYTICS_GROUPS_DATASTORE_KEY} from "../../../../../shared/constants/dataStore";
import {VisualizationGroup} from "../../../../../shared/interfaces";
import {VisGroupUpdateState} from "../components/VisualizationGroupsModal/hooks/save";
// TODO add mechanism for pagination
const query = {
    visualizationGroups: {
        resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
        params: ({page, pageSize}: any) => ({
            fields: [
                "id",
                "name",
                "visualizations",
            ],
            page: page ?? 1,
            pageSize: pageSize ?? 10,
        }),
    },
};


const deleteMutation: any = {
    type: "delete",
    resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
    id: ({id}: { id: string }) => id
};

export function useVisualizationGroups(onEdit: () => void): {
    loading: boolean;
    error: any;
    refetch: any;
    pager: { page: number; pageSize: number };
    visualizationGroups: VisualizationGroup[];
} {
    const setGroupUpdate = useSetRecoilState(VisGroupUpdateState);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const {confirm} = useConfirmDialog();
    const {data, loading, error, refetch} = useDataQuery<{
				visualizationGroups: { pager: any; entries: (VisualizationGroup & { key: string })[] }
				    }>(query);

    const [deleteGroup] = useDataMutation(deleteMutation, {
        onComplete: () => {
            show({message: i18n.t("Visualization group deleted successfully"), type: {success: true}});
            refetch();
        },
        onError: (err) => {
            show({message: `${i18n.t("Error deleting group")}: ${err.message}`, type: {critical: true}});
        }
    });

    const {entries, pager} = data?.visualizationGroups ?? {};

    const visualizationGroups: any = (entries ?? []).map(
        (
            entry: any,
            index: number
        ): any => {
            const {id, name, visualizations} = entry ?? {};
            return {
                index: index + 1,
                id: id ?? "" as string,
                name: name ?? "",
                visualizations: <div style={{gap: 8}} className="row">
                    {
                        (visualizations ?? []).map(({name, id}: any) => (
                            <div key={`${id}-tag`}><Tag>{name}</Tag></div>))
                    }
                </div>,
                action: (<ActionButton
                    actions={[
                        {
                            label: i18n.t("Edit"),
                            key: id,
                            onClick: () => {
                                setGroupUpdate(entry);
                                onEdit();
                            }
                        },
                        {
                            label: i18n.t("Delete"),
                            key: id,
                            onClick: () => {
                                confirm({
                                    loadingText: i18n.t("Deleting..."),
                                    confirmButtonText: i18n.t("Delete"),
                                    title: i18n.t("Confirm delete"),
                                    message: i18n.t("Are you sure you want to delete the group {{name}}?", {
                                        name: name
                                    }),
                                    onCancel: () => {
                                    },
                                    onConfirm: async () => {
                                        await deleteGroup({
                                            id: entry.key
                                        });
                                    }
                                });
                            }
                        },
                    ]}
                    row={entry}
                />)
            };
        }
    );

    return {
        loading,
        error,
        refetch,
        pager,
        visualizationGroups,
    };
}
