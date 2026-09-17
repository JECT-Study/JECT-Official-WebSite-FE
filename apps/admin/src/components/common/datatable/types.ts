import type { ReactNode } from "react";

export interface DataTableColumnMeta<TData> {
  /** 지정하면 이 열을 행 제목 칸(TitleCell)으로 그리고, 반환값을 설명 줄에 쓴다. */
  titleDescription?: (row: TData) => ReactNode;
  /** 체크박스 열이면 고정 너비의 체크박스 칸으로 그린다. */
  isCheckbox?: boolean;
}
