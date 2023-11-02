import React from "react";
import {Pagination} from "../../../../../../../shared/interfaces";

export interface DataTableColumn {
		label: string;
		key: string;
		visible: boolean;
		sortable?: boolean;
		width?: number;
		mandatory?: boolean;
}

export interface SortConfig {
		name: string;
		direction: "asc" | "desc" | "default";
}

export interface DataTableRow {
    background?: string;
    flags?: {
        vaccineUpdated?: boolean;
        profileUpdated?: boolean;
    };
    fullyVaccinated?: boolean;

    [key: string]: any;
}

export type DataTableColumns = DataTableColumn[];
export type DataTableRows = DataTableRow[];

export interface TableAction {
    label: string;
    key: string;
    icon?: React.ReactNode;
    onClick: (row: DataTableRow) => void;
}

export interface CustomDataTableProps {
    columns: DataTableColumns;
    rows: DataTableRows;
    pagination?: Pagination;
    onSort?: (sort: SortConfig) => void;
    sort?: SortConfig;
    loading?: boolean;
    onRowClick?: (row: DataTableRow, event: any) => void;
    actions?: TableAction[];
}
