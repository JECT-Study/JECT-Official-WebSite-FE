import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DataTableRow, type DataTableRowProps } from "./DataTablePrimitives";
import { DragHandleContext } from "./DraggableRow.context";

interface DraggableRowProps extends DataTableRowProps {
  id: string;
}

export function DraggableRow({ id, ...props }: DraggableRowProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    newIndex,
    items,
  } = useSortable({ id });
  const { activeNodeRect, containerNodeRect } = useDndContext();

  // 끌고 있는 행은 순서가 아니라 실제 위치로 판단해, 표 바닥에 닿기 전까지는 아래 선을 그린다.
  const visuallyLast = isDragging
    ? activeNodeRect !== null &&
      containerNodeRect !== null &&
      activeNodeRect.bottom + (transform?.y ?? 0) >= containerNodeRect.bottom - 0.5
    : newIndex === items.length - 1;

  return (
    <DragHandleContext value={{ handleRef: setActivatorNodeRef, attributes, listeners }}>
      <DataTableRow
        ref={setNodeRef}
        dragging={isDragging}
        data-visually-last={visuallyLast}
        // 행의 크기가 바뀌지 않도록 scale 없이 이동만 적용하고, 뒤따르는 행 위로 그려지게 한다.
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
          position: "relative",
          zIndex: isDragging ? 1 : undefined,
        }}
        {...props}
      />
    </DragHandleContext>
  );
}
