import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {uid} from "@hisptz/dhis2-utils";
import {useCallback, useMemo} from "react";
import {atom, useRecoilValue} from "recoil";
import {GATEWAY_DATASTORE_KEY} from "../../../../../../../shared/constants/dataStore";
import {Gateway} from "../../../schema";


const generateGatewayCreateMutation = (id: string): any => ({
    type: "create",
    resource: `dataStore/${GATEWAY_DATASTORE_KEY}/${id}`,
    data: ({data}: any) => data
});

const updateGatewayMutation: any = {
    type: "update",
    resource: `dataStore/${GATEWAY_DATASTORE_KEY}`,
    id: ({data}: any) => data.key,
    data: ({data}: any) => data
};


export const GatewayUpdateState = atom<Gateway | null>({
    key: "gateway-update-state",
    default: null,
});

export function useSaveGateway() {
    const gateway = useRecoilValue(GatewayUpdateState);
    const id = useMemo(() => uid(), []);
    const {show, hide} = useAlert(({message}: { message: string }) => message, ({type}: {
				type: Record<string, any>
		}) => ({
        ...type,
        duration: 3000
    }));
    const [create, {loading: creating}] = useDataMutation(generateGatewayCreateMutation(id), {
        onComplete: () => {
            show({message: i18n.t("Gateway config saved successfully"), type: {success: true}});
        },
        onError: (error) => {
            show({
                message: `${i18n.t("Could not save gateway information")}: ${error.message}`,
                type: {critical: true}
            });
            setTimeout(hide, 5000);
        }
    });
    const [update, {loading: updating}] = useDataMutation(updateGatewayMutation, {
        onComplete: () => {
            show({message: i18n.t("Gateway config updated successfully"), type: {success: true}});
        },
        onError: (error) => {
            show({
                message: `${i18n.t("Could not update gateway information")}: ${error.message}`,
                type: {critical: true}
            });
            setTimeout(hide, 5000);
        }
    });

    const save = useCallback(async (config: Gateway) => {
        if (gateway || config.id) {
            return await update({
                data: config
            });
        } else {
            return await create({
                data: {
                    // @ts-ignore
                    id,
                    ...config,
                }
            });
        }
    }, [gateway, id]);

    return {
        save,
        creating,
        updating
    };
}
