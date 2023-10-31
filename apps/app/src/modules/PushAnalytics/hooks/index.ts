import { useDataQuery } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { PUSH_ANALYTICS_DATASTORE_KEY } from "../../../shared/constants/dataStore";
import { PushAnalytics } from "../../../shared/interfaces";

// TODO add mechanism for pagination
const query = {
    pushAnalytics: {
        resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
        params: ({page, pageSize}: any) => ({
            fields: [
                "id",
                "name",
                "logs",
                "contacts",
                "gateway",
                "description",
                "visualizations",
                "created",
                "lastUpdated",
                "createdBy",
            ],
            page: page ?? 1,
            pageSize: pageSize ?? 10,
        }),
    },
};

export function usePushAnalytics(): any {
    const {data, loading, error, refetch} = useDataQuery(query);

    const {entries, pager} = data.pushAnalytics ?? {};

    const pushAnalytics: PushAnalytics[] = (entries ?? []).map(
        ({
						 id,
						 name,
						 gateway,
						 logs,
						 contacts,
						 description,
						 visualizations,
						 created,
						 lastUpdated,
						 createdBy,
				 }: any): PushAnalytics => {
            return {
                id: id ?? "",
                name: name ?? "",
                logs: logs ?? [],
                contacts: contacts ?? [],
                gateway: gateway ?? "",
                description: description ?? "",
                visualizations: visualizations ?? [],
                created: created ?? "N/A",
                lastUpdated: lastUpdated ?? "N/A",
                createdBy: createdBy ?? "N/A",
            };
        }
    );

    return {
        loading,
        error,
        refetch,
        pager,
        pushAnalytics,
    };
}
