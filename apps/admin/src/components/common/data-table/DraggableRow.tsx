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
  } = useSortable({ id });

  return (
    <DragHandleContext value={{ handleRef: setActivatorNodeRef, attributes, listeners }}>
      <DataTableRow
        ref={setNodeRef}
        dragging={isDragging}
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
