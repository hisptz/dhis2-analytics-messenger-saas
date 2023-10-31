import {useDataQuery} from "@dhis2/app-runtime";
import {useMemo} from "react";

const userQuery = {
    users: {
        resource: "users",
        params: {
            paging: false,
            filter: [
                "whatsApp:!null"
            ],
            fields: [
                "id",
                "displayName",
                "whatsApp"
            ]
        }
    }
};


export function useDHIS2Users() {
    const {data, loading, error} = useDataQuery<{
        users: {
            users: { id: string; displayName: string; whatsApp: string }[]
        }
    }>(userQuery);

    const users = useMemo(() => {
        return data?.users?.users?.map((user) => ({...user, whatsApp: user.whatsApp.replace("+", "")})) ?? [];
    }, [data]);

    return {
        users,
        loading,
        error
    };

}
