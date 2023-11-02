import axios from "axios";
import {useCallback} from "react";
import {useGateways} from "../../modules/Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../modules/Configuration/components/Gateway/schema";

export function usePushServiceClient() {
    const {gateways, loading} = useGateways();

    const getClient = (gateway: Gateway) => {
        return axios.create({
            baseURL: gateway.url,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": gateway.apiKey
            },
        });
    };
    const getClientById = useCallback((gatewayId: string) => {
        const gateway = gateways.find(g => g.id === gatewayId);
        if (!gateway) {
            throw new Error("Gateway not found");
        }
        return getClient(gateway);
    }, [gateways, loading]);


    return {
        getClientById,
        getClient
    };
}
