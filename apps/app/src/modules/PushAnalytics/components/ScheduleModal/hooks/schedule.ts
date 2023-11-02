import {useAlert} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {uid} from "@hisptz/dhis2-utils";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AxiosInstance} from "axios";
import {useMemo} from "react";
import {usePushServiceClient} from "../../../../../shared/hooks/pushService";
import {PushAnalytics} from "../../../../../shared/interfaces";


export interface PushSchedule {
    cron: string;
    enabled: boolean;
    id?: string
    job?: {
        id: string
    }
}


function formatData(data: PushSchedule) {
    return {
        ...data,
        id: data.id ?? uid()
    };
}

async function create(data: PushSchedule, client: AxiosInstance) {
    const payload = formatData(data);
    try {
        console.log("This function?");
        const endpoint = "/bot/schedules";
        const response = await client.post(endpoint, payload);
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function remove(id: string, client: AxiosInstance) {
    try {
        const endpoint = `/bot/schedules/${id}`;
        const response = await client.delete(endpoint);
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function update(updatedValue: PushSchedule, client: AxiosInstance) {
    try {
        const endpoint = `/bot/schedules/${updatedValue.id}`;
        const response = await client.put(endpoint, {
            ...updatedValue,
        });
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export function usePushJobData({gatewayId, jobId}: { gatewayId: string, jobId: string }) {
    const {getClientById: getClient} = usePushServiceClient();

    const client = useMemo(() => getClient(gatewayId), [gatewayId, getClient]);

    async function get() {
        try {
            const response = await client.get(`/bot/jobs/${jobId}`);
            return response.data ?? null;
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    const {isLoading, data} = useQuery([jobId], async () => get(), {enabled: !!jobId});

    return {
        loading: isLoading,
        data
    };
}

export function useManagePushSchedule(config: PushAnalytics, defaultValue?: PushSchedule, onComplete?: () => void) {
    const {getClientById: getClient} = usePushServiceClient();
    const client = useMemo(() => getClient(config.gateway), [config.gateway, getClient]);
    const queryClient = useQueryClient();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const {mutateAsync: onAdd, isLoading} = useMutation([config.id, "schedule"], async (data: { cron: string }) => {
        if (defaultValue) {
            return await update({
                ...defaultValue,
                ...data
            }, client);
        } else {
            return await create({
                ...data,
                enabled: true,
                job: {
                    id: config.id
                }
            }, client);
        }
    }, {
        onError: (error: any) => {
            show({message: `${i18n.t("Error scheduling push")}: ${error.message}`, type: {info: true}});
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [config.id]});
            if (defaultValue) {
                show({message: i18n.t("Schedule updated successfully"), type: {success: true}});
            } else {
                show({message: i18n.t("Schedule added successfully"), type: {success: true}});
            }
            if (onComplete) {
                onComplete();
            }
        }
    });
    const {mutateAsync: onDelete} = useMutation([config.id], async (id: string) => {
        const response = await remove(id, client);
        await queryClient.invalidateQueries([config.id]);
        return response;
    });

    return {
        saving: isLoading,
        onAdd,
        onDelete
    };
}
