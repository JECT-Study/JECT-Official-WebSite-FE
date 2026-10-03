import type { RowData } from "@tanstack/react-table";

import type { DataTableColumnHelper } from "./DataTable.features";
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
