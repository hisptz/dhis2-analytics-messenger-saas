import {useAlert} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {useMutation} from "@tanstack/react-query";
import {AxiosInstance} from "axios";
import {useCallback} from "react";
import {usePushServiceClient} from "../../../../../shared/hooks/pushService";
import {PushAnalytics} from "../../../../../shared/interfaces";

async function sendMessage({id, client}: { id: string, client: AxiosInstance }) {
    const endpoint = `/bot/jobs/${id}/push`;
    const {data} = await client.post(endpoint);
    return data;
}

export function useSendAnalytics() {
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: any) => ({...type, duration: 3000}));
    const {getClientById: getClient} = usePushServiceClient();
    const mutation = useMutation([], {
        mutationFn: sendMessage
    });

    const send = useCallback(
        async ({gateway, id}: PushAnalytics) => {
            try {
                await mutation.mutateAsync({
                    id,
                    client: getClient(gateway),
                }, {
                    onSuccess: () => {
                        show({message: i18n.t("Message sent successfully"), type: {success: true}});
                    },
                    onError: (e: any) => {
                        show({message: `${i18n.t("Error sending message(s)")}: ${e.message}`, type: {info: true}});
                    }
                });

            } catch (e: any) {
                show({message: `${i18n.t("Error sending message(s)")}: ${e.message}`, type: {critical: true}});
            }
        },
        [getClient],
    );

    return {
        send,
        loading: mutation.isLoading
    };
}
