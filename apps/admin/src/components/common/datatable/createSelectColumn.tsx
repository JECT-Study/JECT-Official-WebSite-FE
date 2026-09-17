import { Checkbox } from "@jects/jds";
import type {
  CellContext,
  ColumnHelper,
  DisplayColumnDef,
  HeaderContext,
  RowData,
} from "@tanstack/react-table";
import {
  row_getIsSelected,
  row_toggleSelected,
  table_getIsAllRowsSelected,
  table_getIsSomeRowsSelected,
  table_toggleAllRowsSelected,
} from "@tanstack/react-table/static-functions";

import type { DataTableColumnMeta, DataTableSelectionFeatures } from "./types";

interface CreateSelectColumnOptions<TData> {
  /** 행 체크박스의 aria-label에 쓸 이름. "{이름} 선택"으로 읽힌다. */
  getRowName: (row: TData) => string;
}

/** useTable에 getRowId를 지정한다. 없으면 선택 상태가 행 순서로 저장돼 데이터가 바뀔 때 다른 행이 선택된다. */
export function createSelectColumn<
  TFeatures extends DataTableSelectionFeatures<TData>,
  TData extends RowData,
>(columnHelper: ColumnHelper<TFeatures, TData>, { getRowName }: CreateSelectColumnOptions<TData>) {
  const meta: DataTableColumnMeta<TData> = { cellType: "checkbox" };

  // TFeatures가 제네릭이면 table, row의 선택 메서드와 열 정의 타입을 추론할 수 없어 정적 함수와 단언으로 대신한다.
  // 선택 기능과 meta가 등록됐는지는 호출하는 쪽에서 TFeatures 제약이 검사한다.
  return columnHelper.display({
    id: "select",
    header: ({ table }: HeaderContext<TFeatures, TData>) => (
      <Checkbox
        size="lg"
        aria-label="전체 선택"
        checked={
          table_getIsAllRowsSelected(table)
            ? true
            : table_getIsSomeRowsSelected(table)
              ? "indeterminate"
              : false
        }
        onCheckedChange={(next) => table_toggleAllRowsSelected(table, next === true)}
      />
    ),
    cell: ({ row }: CellContext<TFeatures, TData>) => (
      <Checkbox
        size="lg"
        aria-label={`${getRowName(row.original)} 선택`}
        checked={row_getIsSelected(row)}
        onCheckedChange={(next) => row_toggleSelected(row, next === true)}
      />
    ),
    meta,
  } as unknown as DisplayColumnDef<TFeatures, TData>);
}
