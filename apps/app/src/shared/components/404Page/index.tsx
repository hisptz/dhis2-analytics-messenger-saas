import i18n from "@dhis2/d2-i18n";
import {IconError24, Button, colors} from "@dhis2/ui";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function PageNotFound(): React.ReactElement {
    const navigate = useNavigate();

    return (
        <div className=" h-100 w-100 column center align-center">
            <div className="icon-size-64">
                <IconError24 color={colors.grey800}/>
            </div>
            <h1 style={{color: colors.grey700}}>{i18n.t("Page not Found")}</h1>
            <Button primary onClick={() => navigate("/")}>
                {i18n.t("Go to home")}
            </Button>
        </div>
    );
}
