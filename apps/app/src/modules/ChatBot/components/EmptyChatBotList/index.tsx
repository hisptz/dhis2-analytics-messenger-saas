import i18n from "@dhis2/d2-i18n";
import React from "react";
import {ChatBotSvg} from "../Icons";

interface EmptyChatBotListParams {
}

export default function EmptyChatBotList({}: EmptyChatBotListParams): React.ReactElement {
    return (
        <div style={{gap: 8}} className="w-100 h-100 column center align-center">
            <ChatBotSvg/>
            <h3 style={{margin: 0}}>{i18n.t("Coming soon")}</h3>
            <p style={{margin: 0}} className="pt-16 center">
                {i18n.t(
                    "Here is where you can configure different flows for the DHIS2 chat bot"
                )}
            </p>
        </div>
    );
}
