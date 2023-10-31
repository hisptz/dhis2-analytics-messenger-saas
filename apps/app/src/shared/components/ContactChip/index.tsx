import {Chip, IconUser24, IconUserGroup24} from "@dhis2/ui";
import {find} from "lodash";
import React from "react";
import {useDHIS2Users} from "../../hooks/users";
import {useWhatsappData} from "../../hooks/whatsapp";


export interface ContactNameProps {
    number: string;
    type: "individual" | "group" | "user",
    gatewayId: string;
}


export function ContactName({gatewayId, type, number}: ContactNameProps) {
    const {groups} = useWhatsappData(gatewayId);
    const {users} = useDHIS2Users();

    function getGroup(value: string) {
        return find(groups, ({id}: { id: string }) => id.includes(value))?.name ?? value;
    }

    function getUser(value: string) {
        return find(users, ({whatsApp}) => whatsApp.includes(value))?.displayName ?? value;
    }

    if (type === "group") {
        return <>{getGroup(number)}</>;
    }
    return <>{getUser(number)}</>;
}

export interface ContactChipProps {
    number: string;
    type: "individual" | "group" | "user",
    gatewayId: string;
    onRemove?: () => void
}

export function ContactChip({onRemove, type, ...props}: ContactChipProps) {

    console.log({type});

    return (
        <Chip
            onRemove={onRemove}
            icon={type === "group" ? <IconUserGroup24/> : <IconUser24/>}>
            <ContactName type={type} {...props}/>
        </Chip>
    );

}
