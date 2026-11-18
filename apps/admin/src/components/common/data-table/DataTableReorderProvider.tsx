import type { ReactNode } from "react";

// 최신 버전(@dnd-kit/react)은 드래그 중인 행을 top layer에 그리고 원래 자리에 placeholder를 넣어,
// 마지막 자리로 옮기면 표의 둥근 모서리에 잘리지 않고 group-last 스타일도 적용되지 않는다.
// 최신 버전에서 해결될 때까지 레거시 버전을 쓰고, 해결되면 다시 마이그레이션한다.
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactTable, RowData } from "@tanstack/react-table";

import type { DataTableFeatures } from "./DataTable.features";

const MODIFIERS = [restrictToVerticalAxis, restrictToParentElement];
// 스크린 리더용 div가 tbody 안에 렌더링되면 마지막 행이 :last-child가 아니게 되므로 body로 옮긴다.
const ACCESSIBILITY = { container: document.body };

interface DataTableReorderProviderProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures<TData>, TData>;
  children: ReactNode;
}

export function DataTableReorderProvider<TData extends RowData>({
  table,
  children,
}: DataTableReorderProviderProps<TData>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const rowIds = table.getRowModel().rows.map((row) => row.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const { getRowId } = table.options;
    if (!getRowId || !over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    table.options.meta?.reorder?.onReorder((data) => {
      const dataIds = data.map((row, index) => getRowId(row, index));
      const oldIndex = dataIds.indexOf(activeId);
      const newIndex = dataIds.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return data;

      return arrayMove(data, oldIndex, newIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={MODIFIERS}
      accessibility={ACCESSIBILITY}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
