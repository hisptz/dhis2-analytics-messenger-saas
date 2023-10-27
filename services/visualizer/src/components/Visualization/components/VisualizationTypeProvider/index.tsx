import React, {createContext, useContext, useState} from "react";
import {VisualizationConfig} from "../../index";

export type VisualizationType = "pivotTable" | "chart" | "map";


export const VisualizationTypeContext = createContext<VisualizationType>('pivotTable')
export const VisualizationConfigContext = createContext<VisualizationConfig | undefined>(undefined);
export const VisualizationTypeSetter = createContext<React.Dispatch<React.SetStateAction<VisualizationType>> | undefined>(undefined)

export interface VisualizationTypeProviderProps {
    children: React.ReactNode;
    defaultType: VisualizationType;
    config: VisualizationConfig
}

export function useVisualizationType() {
    return [
        useContext(VisualizationTypeContext),
        useContext(VisualizationTypeSetter)
    ] as [VisualizationType, React.Dispatch<React.SetStateAction<VisualizationType>>]
}

export function useVisualizationConfig() {
    return useContext(VisualizationConfigContext);
}

export function VisualizationTypeProvider({children, defaultType, config}: VisualizationTypeProviderProps) {
    const [type, setType] = useState<VisualizationType>(defaultType);

    return (
        <VisualizationTypeContext.Provider value={type}>
            <VisualizationConfigContext.Provider value={config}>
                <VisualizationTypeSetter.Provider value={setType}>
                    {children}
                </VisualizationTypeSetter.Provider>
            </VisualizationConfigContext.Provider>
        </VisualizationTypeContext.Provider>
    )
}
