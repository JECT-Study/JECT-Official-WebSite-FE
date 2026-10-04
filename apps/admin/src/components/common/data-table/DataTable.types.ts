import type { ReactNode } from "react";

/** 지정하지 않으면 일반 셀로 그린다. */
export type DataTableColumnMeta<TData> =
  { cellType: "control" } | { cellType: "title"; getDescription: (row: TData) => ReactNode };

export interface DataTableReorderOptions<TData> {
  /**
   * 새 순서를 만드는 함수를 받는다. useState의 setter를 그대로 넘길 수 있다.
   */
  onReorder: (updater: (rows: TData[]) => TData[]) => void;
}

export interface DataTableMeta<TData> {
  reorder?: DataTableReorderOptions<TData>;
}
