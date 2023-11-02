import {FlyoutMenu, IconMore24, MenuItem, Popover} from "@dhis2/ui";
import {IconButton} from "@mui/material";
import React, {useState} from "react";
import {TableAction} from "../interfaces";

export function ActionButton({
																 actions,
																 row,
														 }: {
		actions?: TableAction[];
		row: any;
}) {
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

    return (
        <>
            <IconButton
                style={{
                    padding: 2,
                }}
                onClick={(event: any) => {
                    event?.stopPropagation();
                    event.preventDefault();
                    setButtonRef(event.target);
                }}
            >
                <IconMore24 />
            </IconButton>
            {buttonRef && (
                <Popover onClickOutside={() => setButtonRef(null)} reference={buttonRef}>
                    <FlyoutMenu dense>
                        {actions?.map((action) => (
                            <MenuItem
                                onClick={() => {
                                    setButtonRef(null);
                                    action.onClick(row);
                                }}
                                key={`${action.key}-menu-item`}
                                icon={action.icon}
                                label={action.label}
                            />
                        ))}
                    </FlyoutMenu>
                </Popover>
            )}
        </>
    );
}
