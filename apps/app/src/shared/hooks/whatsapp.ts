import {useQuery} from "@tanstack/react-query";
import {AxiosInstance} from "axios";
import {head} from "lodash";
import {useCallback, useEffect, useMemo} from "react";
import {usePushServiceClient} from "./pushService";


async function getWhatsappData(client: AxiosInstance) {
    if (!client) {
        return;
    }
    const endpoint = "/whatsapp/groups";
    const {data} = await client.get(endpoint);
    return data;
}

export function useWhatsappData(gatewayId?: string) {
    const {getClientById: getClient} = usePushServiceClient();
    const {
        data,
        isLoading,
        refetch,
    } = useQuery<{
        groups: Array<{ id: string; name: string }>
    }>([gatewayId, "whatsapp"], async ({queryKey}) => getWhatsappData(getClient(head(queryKey) as string)), {
        enabled: !!gatewayId,
        refetchOnWindowFocus: false,
        keepPreviousData: true
    });
    const groups = useMemo(() => data?.groups.map((group) => ({
        ...group,
        id: group.id.replace("@g.us", "")
    })) ?? [], [data]);

    const fetchGroups = useCallback(async (gatewayId: unknown) => {
        return refetch({queryKey: [gatewayId, "whatsapp"]});
    }, []);

    useEffect(() => {
        refetch();
    }, [gatewayId]);

    return {
        groups,
        fetchGroups,
        loading: isLoading
    };
}
