import type { RowData } from "@tanstack/react-table";

import type { DataTableColumnHelper } from "./createDataTableFeatures";
import { DragHandle } from "./DragHandle";

export function createDragColumn<TData extends RowData>(
  columnHelper: DataTableColumnHelper<TData>
) {
  return columnHelper.display({
    id: "drag",
    cell: () => <DragHandle />,
    meta: { cellType: "control" },
  });
}
