import React, {useMemo} from "react";
import {useVisualizationConfig, useVisualizationType, VisualizationType} from "../VisualizationTypeProvider";
import {Button, IconTable24, IconVisualizationColumn24, IconWorld24, Tooltip} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';

const supportedVisualizationTypes = [
    {
        id: "pivotTable",
        icon: <IconTable24/>,
        label: i18n.t("Pivot table")
    },
    {
        id: "chart",
        icon: <IconVisualizationColumn24/>,
        label: i18n.t("Chart")
    }, {
        id: "map",
        icon: <IconWorld24/>,
        label: i18n.t("Map")
    }
]

export function VisualizationTypeSelector() {
    const [type, setType] = useVisualizationType();
    const config = useVisualizationConfig();

    const types = useMemo(() => supportedVisualizationTypes.filter((supportedType) => {
        return Object.keys(config ?? {}).includes(supportedType.id) && supportedType.id !== type
    }), [type, config]);

    return (
        <div style={{display: "flex", gap: 8}}>
            {
                types.map(({icon, label, id}) => {
                    return (
                        <Tooltip key={`${label}-tooltip`} content={i18n.t("View as {{type}}", {
                            type: label.toLowerCase()
                        })}>
                            <Button onClick={() => setType(id as VisualizationType)} icon={icon}/>
                        </Tooltip>
                    )
                })
            }
        </div>
    )
}
