import React from "react";
import VisualizationGroupsTable from "./components/VisualizationGroupsTable";

export default function VisualizationGroupsConfiguration(): React.ReactElement {
    return (
        <div>
            <div className="pt-8">
                <VisualizationGroupsTable/>
            </div>
        </div>
    );
}
