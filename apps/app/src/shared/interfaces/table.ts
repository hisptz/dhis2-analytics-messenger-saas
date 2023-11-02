export interface Column {
  label: string;
  key: string;
}

export interface CustomTableProps {
  columns: Column[];
  data: Record<string, any>[];
  pagination?: Pagination;
  loading?: boolean;
  emptyTableMessage?: string;
}

export interface Pagination {
  page: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
  isLastPage?: boolean;
  nextPageText?: string | (() => string);
  previousPageText?: string | (() => string);
  pageSummaryText?: string | (() => string);
  hidePageSizeSelect?: boolean;
  hidePageSummary?: boolean;
  hidePageSelect?: boolean;
  pageSizes?: string[];
  total: number;
}
