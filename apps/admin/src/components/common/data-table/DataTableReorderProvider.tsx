import type { ReactNode } from "react";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { arrayMove } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import type { ReactTable, RowData } from "@tanstack/react-table";

import type { DataTableFeatures } from "./DataTable.features";

const MODIFIERS = [
  RestrictToVerticalAxis,
  RestrictToElement.configure({
    element: (operation) => operation.source?.element?.closest("tbody") ?? null,
  }),
];

interface DataTableReorderProviderProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures<TData>, TData>;
  children: ReactNode;
}

export function DataTableReorderProvider<TData extends RowData>({
  table,
  children,
}: DataTableReorderProviderProps<TData>) {
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const { source } = event.operation;
    if (!isSortable(source)) return;

    // 낙관적 정렬로 드롭 시점의 target은 source 자신이므로 목적지 행은 드래그 전 순서에서 구한다.
    const rowIds = table.getRowModel().rows.map((row) => row.id);
    const activeId = String(source.id);
    const overId = rowIds[source.index];
    const { getRowId } = table.options;
    if (!getRowId || overId === undefined || activeId === overId) return;

    table.options.meta?.reorder?.onReorder((data) => {
      const dataIds = data.map((row, index) => getRowId(row, index));
      const oldIndex = dataIds.indexOf(activeId);
      const newIndex = dataIds.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return data;

      return arrayMove(data, oldIndex, newIndex);
    });
  };

  return (
    <DragDropProvider modifiers={MODIFIERS} onDragEnd={handleDragEnd}>
      {children}
    </DragDropProvider>
  );
}
