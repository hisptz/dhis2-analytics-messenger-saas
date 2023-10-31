import i18n from "@dhis2/d2-i18n";
import React from "react";
import {AnalyticsIcon16, SettingsIcon16,} from "../components/Icons/Icons";
import {NavigationItem} from "../interfaces";

// Main pages
const PushAnalyticsPage = React.lazy(
    () => import("../../modules/PushAnalytics")
);
// const ChatBotPage = React.lazy(() => import("../../modules/ChatBot"));
const ConfigurationPage = React.lazy(
    () => import("../../modules/Configuration")
);
const ConfigurationOutlet = React.lazy(() =>
    import("../../modules/Configuration").then((module) => ({
        default: module.ConfigurationOutlet,
    }))
);

// Sub-pages
const VisualizationGroupsConfiguration = React.lazy(
    () => import("../../modules/Configuration/components/VisualizationGroups")
);
const GatewayConfiguration = React.lazy(
    () => import("../../modules/Configuration/components/Gateway")
);

// configuration navigation items
export const CONFIGURATION_NAVIGATION_ITEMS: Array<NavigationItem> = [
    {
        label: i18n.t("Gateway"),
        path: "gateway",
        element: GatewayConfiguration,
    },
    {
        label: i18n.t("Visualization groups"),
        path: "visualization-groups",
        element: VisualizationGroupsConfiguration,
    },
    {
        path: "",
        element: ConfigurationPage,
    },
];

// Main navigation items
export const NAVIGATION_ITEMS: Array<NavigationItem> = [
    {
        label: i18n.t("Push Analytics"),
        path: "push-analytics",
        icon: AnalyticsIcon16,
        element: PushAnalyticsPage,
    },
    // {
    //     label: i18n.t("Chat Bot"),
    //     path: "chat-bot",
    //     icon: ChatBotIcon16,
    //     element: ChatBotPage,
    // },
    {
        label: i18n.t("Configuration"),
        path: "configuration",
        icon: SettingsIcon16,
        element: ConfigurationOutlet,
        subItems: CONFIGURATION_NAVIGATION_ITEMS,
    },
];
