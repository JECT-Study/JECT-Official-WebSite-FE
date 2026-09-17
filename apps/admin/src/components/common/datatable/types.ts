import type { ReactNode } from "react";

/** 열을 일반 칸이 아닌 칸 종류로 그릴 때 지정한다. 지정하지 않으면 일반 칸이다. */
export type DataTableColumnMeta<TData> =
  { cellType: "checkbox" } | { cellType: "title"; getDescription: (row: TData) => ReactNode };

export interface DataTableMeta<TData> {
  /** 선택 체크박스의 aria-label에 쓸 이름. 선택 기능을 쓸 때만 있다. */
  getRowName?: (row: TData) => string;
}
