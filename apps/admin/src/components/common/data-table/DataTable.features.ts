import {
  type ColumnDef,
  type ColumnHelper,
  createColumnHelper,
  metaHelper,
  type RowData,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table";

import type { DataTableColumnMeta, DataTableMeta } from "./DataTable.types";

// 기능 목록을 고정해야 행 타입만 제네릭인 상태에서도 표, 행, 열 정의의 타입이 추론된다.
export function createDataTableFeatures<TData extends RowData>() {
  return tableFeatures({
    rowSelectionFeature,
    columnMeta: metaHelper<DataTableColumnMeta<TData>>(),
    tableMeta: metaHelper<DataTableMeta<TData>>(),
  });
}

export type DataTableFeatures<TData extends RowData> = ReturnType<
  typeof createDataTableFeatures<TData>
>;

export type DataTableColumnHelper<TData extends RowData> = ColumnHelper<
  DataTableFeatures<TData>,
  TData
>;

export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures<TData>, TData>;

export function createDataTableColumnHelper<TData extends RowData>(): DataTableColumnHelper<TData> {
  return createColumnHelper<DataTableFeatures<TData>, TData>();
}
