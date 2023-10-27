import React, {createContext, useContext, useReducer} from "react";
import {AnalyticsDimension} from "@hisptz/dhis2-utils";
import {set} from "lodash";
import {useUpdateEffect} from "usehooks-ts";

export type Dimension = "ou" | "pe" | "dx" | "co";

export type DimensionUpdater = (data: { dimension: Dimension; value: string[] }) => void
export const DimensionState = createContext<AnalyticsDimension>({
    dx: [],
    pe: [],
    ou: []
})
export const DimensionUpdateState = createContext<DimensionUpdater | undefined>(undefined);


function reducer(state: AnalyticsDimension, {dimension, value}: { dimension: Dimension, value: string[] }) {
    const updatedState = {...(state ?? {})};
    set(updatedState, [dimension], value);
    return updatedState
}

export interface DimensionProviderProps {
    children: React.ReactNode,
    dimensions: AnalyticsDimension
}

export function useDimensions() {
    return [
        useContext(DimensionState),
        useContext(DimensionUpdateState)
    ] as [AnalyticsDimension, DimensionUpdater]
}

export function DimensionsProvider({children, dimensions}: DimensionProviderProps) {
    const [state, dispatch] = useReducer(reducer, dimensions);

    useUpdateEffect(() => {
        Object.keys(dimensions).forEach((dimension: string) => {
            dispatch({dimension: dimension as Dimension, value: dimensions[dimension] ?? []})
        })
    }, [dimensions]);


    return <DimensionState.Provider value={state}>
        <DimensionUpdateState.Provider value={dispatch}>
            {children}
        </DimensionUpdateState.Provider>
    </DimensionState.Provider>
}
