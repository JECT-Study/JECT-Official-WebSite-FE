import { useSortable } from "@dnd-kit/react/sortable";

import { DataTableRow, type DataTableRowProps } from "./DataTablePrimitives";
import { DragHandleContext } from "./DraggableRow.context";

interface DraggableRowProps extends DataTableRowProps {
  id: string;
  index: number;
}

export function DraggableRow({ id, index, ...props }: DraggableRowProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index });

  return (
    <DragHandleContext value={{ handleRef }}>
      <DataTableRow ref={ref} dragging={isDragging} {...props} />
    </DragHandleContext>
  );
}
