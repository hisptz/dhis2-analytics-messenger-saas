import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {uid} from "@hisptz/dhis2-utils";
import {useCallback, useMemo} from "react";
import {atom, useRecoilValue} from "recoil";
import {ANALYTICS_GROUPS_DATASTORE_KEY} from "../../../../../../../shared/constants/dataStore";
import {VisualizationGroup} from "../../../schema";


export const VisGroupUpdateState = atom<VisualizationGroup | null>({
    key: "vis-group-update",
    default: null
});
const generateCreateQuery = (id: string): any => ({
    type: "create",
    resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}/${id}`,
    data: ({data}: any) => data,
});

const updateGroupMutation: any = {
    type: "update",
    resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
    data: ({data}: any) => data,
    id: ({data}: any) => data.key
};

export function useSaveVisualizationGroup() {
    const defaultGroup = useRecoilValue(VisGroupUpdateState);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const id = useMemo(() => uid(), []);
    const [create, {loading: creating}] = useDataMutation(generateCreateQuery(id), {
        onComplete: () => {
            show({message: i18n.t("Visualization group created successfully"), type: {success: true}});
        },
        onError: (e) => {
            show({message: `${i18n.t("Error creating visualization group")}: ${e.message}`, type: {critical: true}});
        }
    });
    const [update, {loading: updating}] = useDataMutation(updateGroupMutation, {
        onComplete: () => {
            show({message: i18n.t("Visualization group updated successfully"), type: {success: true}});
        },
        onError: (e) => {
            show({message: `${i18n.t("Error updating visualization group")}: ${e.message}`, type: {critical: true}});
        }
    });

    const save = useCallback(async (data: VisualizationGroup) => {
        if (defaultGroup || !!data.id) {
            await update({
                data
            });
        } else {
            const newGroup = {
                ...data,
                id
            };
            await create({
                data: newGroup,
            });
        }
    }, [create, update]);

    return {
        save,
        creating,
        updating
    };
}
