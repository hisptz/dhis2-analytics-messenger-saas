import i18n from "@dhis2/d2-i18n";
import {Button, IconAdd16} from "@dhis2/ui";
import React from "react";
import {PushAnalyticsSvg} from "../Icons";
import classes from "./EmptyPushAnalyticsList.module.css";

interface PushAnalyticsListParams {
  anAddPushAnalytics: VoidFunction;
}

export default function EmptyPushAnalyticsList({
																									 anAddPushAnalytics,
																							 }: PushAnalyticsListParams): React.ReactElement {
    return (
        <div className={classes["list-container"]}>
            <PushAnalyticsSvg/>
            <p className="pt-16 center">
                {i18n.t(
                    "There are no Push Analytics configured, click the below button to add new."
                )}
            </p>
            <div className="pt-16 ">
                <Button
                    primary
                    onClick={anAddPushAnalytics}
                    name="Push Analytics"
                    value="pushAnalyticsButton"
                    icon={<IconAdd16/>}
                >
                    {i18n.t("Add push analytics")}
                </Button>
            </div>
        </div>
    );
}
