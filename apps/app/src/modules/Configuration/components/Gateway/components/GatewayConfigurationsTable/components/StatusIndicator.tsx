import {Gateway} from "../../../schema";
import React, {useMemo} from "react";
import {usePushServiceClient} from "../../../../../../../shared/hooks/pushService";
import {useQuery} from "@tanstack/react-query";
import {CircularLoader, IconSync16, Tag, Tooltip} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import {IconButton} from "@mui/material";
import {capitalize} from "lodash";
import {DateTime} from "luxon";
import {AxiosError} from "axios";


export interface StatusIndicatorProps {
    value: Gateway
}

interface StatusData {
    status: string,
    message: string;
    timestamp: number
}

const Wrapper = ({children, refetch, data, isRefetching, customMessage}: {
    children: React.ReactNode,
    refetch: () => void,
    data?: StatusData | null,
    isRefetching: boolean,
    customMessage?: string | React.ReactElement
}) => (
    <div className="row gap-8 align-center">
        <Tooltip
            content={customMessage ?? <div style={{gap: 2}} className="column ">
                <span><b>{i18n.t("Status")}:</b> {capitalize(data?.status) ?? i18n.t("unknown")}</span>
                <span><b>{i18n.t("Message")}:</b> {capitalize(data?.message) ?? ""}</span>
                <span><b>{i18n.t("Last synced at")}:</b> {DateTime.fromJSDate(new Date(data?.timestamp ?? "")).toFormat("yyyy-MM-dd HH:mm:ss") ?? ""}</span>
            </div>}>
            {children}
        </Tooltip>
        <Tooltip content={i18n.t("Refresh")}>
            <IconButton disabled={isRefetching} style={{
                padding: 2,
            }} onClick={() => refetch()}>
                <IconSync16/>
            </IconButton>
        </Tooltip>
    </div>
);

export function StatusIndicator({value}: StatusIndicatorProps) {
    const {getClient} = usePushServiceClient();
    const client = useMemo(() => getClient(value), [value]);
    const getStatus = async () => {
        const endpoint = "/whatsapp/ping";
        const response = await client.get(endpoint);
        return response.data ?? null;
    };

    const {
        isError,
        isLoading,
        data,
        refetch,
        isRefetching,
        error
    } = useQuery<StatusData, AxiosError>([value], getStatus);


    if (isError) {
        return (
            <Wrapper customMessage={<span>{error?.message}</span>} isRefetching={isRefetching} data={data}
                refetch={refetch}>
                <Tag negative bold>
                    {i18n.t("Error")}
                </Tag>
            </Wrapper>
        );
    }

    if (isLoading) {
        return (
            <CircularLoader extrasmall/>
        );
    }


    if (data.status === "online") {
        return (
            <Wrapper isRefetching={isRefetching} data={data} refetch={refetch}>
                <Tag positive bold>
                    {i18n.t("Online")}
                </Tag>
            </Wrapper>
        );
    }


    if (data.status === "offline") {
        return (
            <Wrapper isRefetching={isRefetching} data={data} refetch={refetch}>
                <Tag negative bold>
                    {i18n.t("Offline")}
                </Tag>
            </Wrapper>
        );
    }


    return (
        <></>
    );
}
