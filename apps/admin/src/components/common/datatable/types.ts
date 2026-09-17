import type { ReactNode } from "react";

import type { RowData, TableFeatures } from "@tanstack/react-table";

/** 열을 일반 칸이 아닌 칸 종류로 그릴 때 지정한다. 지정하지 않으면 일반 칸이다. */
export type DataTableColumnMeta<TData> =
  { cellType: "checkbox" } | { cellType: "title"; getDescription: (row: TData) => ReactNode };

export type DataTableFeatures<TData extends RowData> = TableFeatures & {
  columnMeta: DataTableColumnMeta<TData>;
};

export type DataTableSelectionFeatures<TData extends RowData> = DataTableFeatures<TData> & {
  rowSelectionFeature: NonNullable<TableFeatures["rowSelectionFeature"]>;
};
