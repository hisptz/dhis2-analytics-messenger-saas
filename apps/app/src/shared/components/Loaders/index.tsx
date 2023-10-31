import {CenteredContent, CircularLoader} from "@dhis2/ui";
import React from "react";

export default function FullPageLoader({
																					 minHeight,
																					 message,
																			 }: {
		minHeight?: number | string;
		message?: string;
}): React.ReactElement {
    return (
        <div style={{minHeight}} className="column w-100 h-100 align-center center ">
            <CircularLoader small />
            {message && <p>{message}</p>}
        </div>
    );
}

export function CardLoader() {
    return (
        <CenteredContent>
            <CircularLoader small />
        </CenteredContent>
    );
}
