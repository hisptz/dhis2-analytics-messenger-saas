import React from "react";
import {Layout, LayoutProvider} from "../LayoutProvider";
import {AnalyticsDimension} from "@hisptz/dhis2-utils";
import {DimensionsProvider} from "../DimensionsProvider";
import {AnalyticsDataProvider} from "../AnalyticsDataProvider";
import {VisualizationType, VisualizationTypeProvider} from "../VisualizationTypeProvider";
import {VisualizationConfig} from "../../index";


export interface VisualizationProviderProps {
    children: React.ReactNode,
    layout: Layout,
    dimensions: AnalyticsDimension;
    type: VisualizationType;
    config: VisualizationConfig
}

export function VisualizationProvider({layout, dimensions, children, type, config}: VisualizationProviderProps) {

    return (
        <DimensionsProvider dimensions={dimensions}>
            <VisualizationTypeProvider config={config} defaultType={type}>
                <LayoutProvider defaultLayout={layout}>
                    <AnalyticsDataProvider>
                        {children}
                    </AnalyticsDataProvider>
                </LayoutProvider>
            </VisualizationTypeProvider>
        </DimensionsProvider>
    )
}
