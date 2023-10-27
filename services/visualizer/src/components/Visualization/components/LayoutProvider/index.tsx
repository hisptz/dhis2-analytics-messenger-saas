import React, {createContext, useContext, useState} from "react";
import {Dimension} from "../DimensionsProvider";


export interface Layout {
    rows: Dimension[];
    columns: Dimension[];
    filters: Dimension[]
}

export interface LayoutProviderProps {
    children: React.ReactNode;
    defaultLayout: Layout
}

export const LayoutState = createContext<Layout | undefined>(undefined);


export function useLayout() {

    return [
        useContext(LayoutState) ?? {rows: [], filters: [], columns: []}
    ]
}

export function LayoutProvider({defaultLayout, children}: LayoutProviderProps) {
    const [layout, setLayout] = useState(defaultLayout);

    return (
        <LayoutState.Provider value={layout}>
            {children}
        </LayoutState.Provider>
    )
}
