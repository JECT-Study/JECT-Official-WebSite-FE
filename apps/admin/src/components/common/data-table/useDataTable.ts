import { useEffect, useMemo, useState } from "react";

import {
  type OnChangeFn,
  type RowData,
  type RowSelectionState,
  useTable,
} from "@tanstack/react-table";

import { createSelectColumn } from "./createSelectColumn";
import {
  createDataTableColumnHelper,
  createDataTableFeatures,
  type DataTableColumnDef,
} from "./DataTable.features";

interface DataTableSelectionOptions<TData> {
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  /** 체크박스의 aria-label에 쓸 이름. "{이름} 선택"으로 읽힌다. */
  getRowName: (row: TData) => string;
  /** 지정하지 않으면 모든 행을 선택할 수 있다. false를 반환한 행은 disabled로 그린다. */
  canSelect?: (row: TData) => boolean;
}

interface UseDataTableOptions<TData extends RowData> {
  data: TData[];
  /** 렌더마다 새로 만들면 표 모델이 매번 다시 계산되므로 모듈 최상단이나 useMemo로 고정한다. */
  columns: DataTableColumnDef<TData>[];
  /** 선택 상태의 키로 쓰인다. 행 순서를 쓰면 데이터가 바뀔 때 다른 행이 선택된다. */
  getRowId: (row: TData) => string;
  /** 지정하면 체크박스 열이 앞에 붙는다. */
  selection?: DataTableSelectionOptions<TData>;
}

const EMPTY_SELECTION: RowSelectionState = {};

export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  selection,
}: UseDataTableOptions<TData>) {
  const [features] = useState(createDataTableFeatures<TData>);
  const hasSelection = selection !== undefined;

  const tableColumns = useMemo(
    () =>
      hasSelection
        ? [createSelectColumn(createDataTableColumnHelper<TData>()), ...columns]
        : columns,
    [columns, hasSelection]
  );

  const canSelect = selection?.canSelect;
  const rowSelection = selection?.rowSelection;
  const onRowSelectionChange = selection?.onRowSelectionChange;

  // 표는 선택 id가 실제 행에 있는지 확인하지 않는다. 걸러서 넘기지 않으면 지워진 행이 선택된 채로 남는다.
  const tableSelection = useMemo(() => {
    if (!rowSelection) return EMPTY_SELECTION;

    const selectableIds = new Set(data.filter((row) => canSelect?.(row) ?? true).map(getRowId));
    const staleIds = Object.keys(rowSelection).filter((id) => !selectableIds.has(id));
    if (staleIds.length === 0) return rowSelection;

    const next = { ...rowSelection };
    staleIds.forEach((id) => delete next[id]);
    return next;
  }, [canSelect, data, getRowId, rowSelection]);

  // 일괄 작업은 호출부가 들고 있는 선택 상태를 그대로 쓰므로 걸러낸 결과를 되돌려준다.
  useEffect(() => {
    if (tableSelection !== rowSelection) onRowSelectionChange?.(tableSelection);
  }, [onRowSelectionChange, rowSelection, tableSelection]);

  return useTable({
    features,
    columns: tableColumns,
    data,
    getRowId,
    enableRowSelection: canSelect ? (row) => canSelect(row.original) : undefined,
    state: { rowSelection: tableSelection },
    onRowSelectionChange,
    meta: { getRowName: selection?.getRowName },
  });
}
