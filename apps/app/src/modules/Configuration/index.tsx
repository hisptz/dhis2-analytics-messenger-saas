import {Menu, MenuItem} from "@dhis2/ui";
import React from "react";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import {CONFIGURATION_NAVIGATION_ITEMS} from "../../shared/constants/navigation";
import classes from "./Configuration.module.css";

export function ConfigurationOutlet(): React.ReactElement {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div id="configuration-container" className="row w-100 h-100">
            <div className={classes["side-menu"]}>
                <Menu className={classes.menu}>
                    {CONFIGURATION_NAVIGATION_ITEMS.map(({label, path}) =>
                        path !== "" ? (
                            <MenuItem
                                key={path}
                                dataTest={`${label}-menu`}
                                onClick={() => navigate(path)}
                                active={Boolean(location.pathname.match(path))}
                                className={classes["menu-item"]}
                                label={label}
                            />
                        ) : null
                    )}
                </Menu>
            </div>
            <div className={classes["content"]}>
                <Outlet/>
            </div>
        </div>
    );
}

export default function Configuration(): React.ReactElement {
    const firstMenuItem = CONFIGURATION_NAVIGATION_ITEMS[0];
    return firstMenuItem ? <Navigate to={`${firstMenuItem.path}`}/> : <></>;
}
