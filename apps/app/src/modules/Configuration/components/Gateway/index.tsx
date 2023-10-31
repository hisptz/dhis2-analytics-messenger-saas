import i18n from "@dhis2/d2-i18n";
import React from "react";
import GatewayConfigurationsTable from "./components/GatewayConfigurationsTable";

export default function GatewayConfiguration(): React.ReactElement {

    return (
        <div>
            <p className="sub-module-title">{i18n.t("Gateway")}</p>
            <p className="sub-module-subtitle">
                {i18n.t("Configuration of the gateways for push analytics")}
            </p>
            <GatewayConfigurationsTable/>
        </div>
    );
}
