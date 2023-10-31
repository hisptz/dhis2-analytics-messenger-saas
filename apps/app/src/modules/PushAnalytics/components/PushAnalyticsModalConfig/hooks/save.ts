import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {useMutation} from "@tanstack/react-query";
import {AxiosInstance} from "axios";
import {useCallback} from "react";
import {PUSH_ANALYTICS_DATASTORE_KEY} from "../../../../../shared/constants/dataStore";
import {usePushServiceClient} from "../../../../../shared/hooks/pushService";
import {PushAnalytics} from "../../../../../shared/interfaces";

const generateCreateMutation = (id: string): any => ({
    type: "create",
    resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}/${id}`,
    data: ({data}: any) => data
});
const updateMutation: any = {
    type: "update",
    resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
    id: ({id}: any) => id,
    data: ({data}: any) => data
};

const deleteMutation: any = {
    type: "delete",
    resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
    id: ({id}: { id: string }) => id
};

async function updateJob(data: PushAnalytics, client: AxiosInstance) {
    try {
        const endpoint = `/bot/jobs/${data.id}`;
        const {data: responseData} = await client.put(endpoint, data);
        return responseData ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function createJob(data: PushAnalytics, client: AxiosInstance) {
    try {
        const endpoint = "/bot/jobs";
        const {data: responseData} = await client.post(endpoint, data);
        return responseData ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function deleteJob(data: PushAnalytics, client: AxiosInstance) {
    try {
        const endpoint = `/bot/jobs/${data.id}`;
        const {data: responseData} = await client.delete(endpoint);
        return responseData ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export function useManageConfig(id: string, defaultConfig?: PushAnalytics | null) {
    const {getClientById: getClient} = usePushServiceClient();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [create, {loading: creating}] = useDataMutation(generateCreateMutation(id), {});
    const [update, {loading: updating}] = useDataMutation(updateMutation, {});
    const {
        mutateAsync: manageJob,
        isLoading
    } = useMutation<boolean, any, PushAnalytics, any>(["job"], async (data: PushAnalytics) => {
        const client = getClient(data.gateway);
        if (defaultConfig) {
            await updateJob(data, client);
            await update({
                data,
                id: defaultConfig.id
            });
            return true;
        } else {
            const newData = {
                ...data,
                id
            };
            await createJob(newData, client);
            await create({
                data: newData
            });
            return true;
        }
    }, {
        onError: (error: any) => {
            show({message: `${i18n.t("Error saving configuration")}: ${error.message}`, type: {critical: true}});
        },
        onSuccess: () => {
            if (defaultConfig) {
                show({message: i18n.t("Configuration updated successfully"), type: {success: true}});
            } else {
                show({message: i18n.t("Configuration saved successfully"), type: {success: true}});
            }
        }
    });


    const [deleteDataStoreConfig] = useDataMutation(deleteMutation);

    const {mutateAsync: deleteConfig} = useMutation(["config"], async (data: PushAnalytics) => {
        const client = getClient(data.gateway);
        await deleteJob(data, client);
        await deleteDataStoreConfig({id: data.id});
        return true;
    }, {
        onSuccess: () => {
            show({message: i18n.t("Configuration deleted successfully"), type: {success: true}});
        },
        onError: (error: any) => {
            show({message: `${i18n.t("Could not delete configuration:")}: ${error.message}`, type: {critical: true}});
        }
    });


    const save = useCallback(
        async (data: PushAnalytics): Promise<boolean> => {
            return manageJob(data);
        },
        [id, create, update],
    );

    return {
        creating: isLoading || creating,
        updating: isLoading || updating,
        deleteConfig,
        save
    };
}
