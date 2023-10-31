import i18n from "@dhis2/d2-i18n";
import {
    Center,
    CircularLoader,
    colors,
    Cover,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableToolbar,
    Pagination,
    TableHead,
} from "@dhis2/ui";
import {uid} from "@hisptz/dhis2-utils";
import cx from "classnames";
import {isEmpty} from "lodash";
import React, {useRef} from "react";
import {ActionButton} from "./components/ActionButton";
import classes from "./CustomDataTable.module.css";
import {CustomDataTableProps, DataTableColumn, DataTableRow as DataTableRowInterface,} from "./interfaces";

export default function CustomDataTable({
    columns,
    rows,
    pagination,
    onSort,
    sort,
    loading,
    onRowClick,
    actions,
}: CustomDataTableProps): React.ReactElement {
    const tableRef = useRef(uid());

    const height = 800;

    return (
        <div style={{position: "relative", minHeight: height}} className="column">
            {loading && (
                <Cover className={classes["loading-cover"]} translucent>
                    <Center>
                        <CircularLoader small/>
                    </Center>
                </Cover>
            )}
            <DataTable
                className={cx(classes.table, {
                    [classes.loading]: loading && isEmpty(rows),
                })}
                scrollHeight={`${height}px`}
            >
                <colgroup>
                    {columns?.map((col) => (
                        <col key={`${col.key}-col-setup`} width={`${col.width}%`}/>
                    ))}
                </colgroup>
                <TableHead>
                    <tr>
                        {columns.map(({label, key, sortable}: DataTableColumn) => (
                            <DataTableColumnHeader
                                fixed
                                top={"0"}
                                key={`${key}-column-header`}
                                name={key}
                                onSortIconClick={sortable ? onSort : undefined}
                                sortDirection={
                                    sortable
                                        ? sort?.name === key
                                            ? sort?.direction
                                            : "default"
                                        : undefined
                                }
                            >
                                {label}
                            </DataTableColumnHeader>
                        ))}
                    </tr>
                </TableHead>
                <DataTableBody>
                    {isEmpty(rows) && !loading ? (
                        <tr>
                            <td colSpan={columns?.length}>
                                <div
                                    className="column align-center center"
                                    style={{minHeight: height - 64}}
                                >
                                    <h3 style={{color: colors.grey700}}>
                                        {i18n.t(
                                            "There are no bookings for the specified filters"
                                        )}
                                    </h3>
                                </div>
                            </td>
                        </tr>
                    ) : null}

                    {rows.map((row: DataTableRowInterface, index) => (
                        <tr key={`${index}-${tableRef.current}-row`}>
                            {columns.map(({key}: DataTableColumn, columIndex) => {
                                if (key === "actions") {
                                    if (row.fullyVaccinated) {
                                        return (
                                            <DataTableCell
                                                className={classes["actions-cell"]}
                                                backgroundColor={row.background}
                                                align="center"
                                                key={`${key}-actions`}
                                                name={key}
                                            >
                                                <ActionButton row={row} actions={actions}/>
                                            </DataTableCell>
                                        );
                                    } else {
                                        return (
                                            <DataTableCell key={`${key}-actions`} backgroundColor={row.background}/>
                                        );
                                    }
                                }
                                if (row.flags && columIndex === 1) {
                                    return (
                                        <DataTableCell
                                            onClick={(event: any) => {
                                                event.stopPropagation();
                                                onRowClick
                                                    ? onRowClick(row, event)
                                                    : undefined;
                                            }}
                                            backgroundColor={row.background}
                                            key={`${key}-cell`}
                                        >
                                        </DataTableCell>
                                    );
                                }
                                return (
                                    <DataTableCell
                                        onClick={(event: any) => {
                                            event.stopPropagation();
                                            onRowClick ? onRowClick(row, event) : undefined;
                                        }}
                                        backgroundColor={row.background}
                                        key={`${key}-cell`}
                                    >
                                        {row[key]}
                                    </DataTableCell>
                                );
                            })}
                        </tr>
                    ))}
                </DataTableBody>
            </DataTable>
            <DataTableToolbar className={classes["pagination-area"]} position="bottom">
                {pagination && (
                    <div className="w-100">
                        <Pagination {...pagination} />
                    </div>
                )}
            </DataTableToolbar>
        </div>
    );
}
