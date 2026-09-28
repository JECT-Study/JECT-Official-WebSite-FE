import type { RowData } from "@tanstack/react-table";

import type { DataTableColumnHelper } from "./DataTable.features";
import { DragHandle } from "./DragHandle";

export function createDragColumn<TData extends RowData>(
  columnHelper: DataTableColumnHelper<TData>
) {
  return columnHelper.display({
    id: "drag",
    cell: ({ row, table }) => (
      <DragHandle label={`${table.options.meta?.getRowName?.(row.original) ?? "행"} 순서 변경`} />
    ),
    meta: { cellType: "control" },
  });
}
