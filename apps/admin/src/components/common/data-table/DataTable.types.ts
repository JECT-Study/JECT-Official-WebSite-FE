import type { ReactNode } from "react";

/** 지정하지 않으면 일반 셀로 그린다. */
export type DataTableColumnMeta<TData> =
  { cellType: "control" } | { cellType: "title"; getDescription: (row: TData) => ReactNode };

export interface DataTableMeta<TData> {
  getRowName?: (row: TData) => string;
}
