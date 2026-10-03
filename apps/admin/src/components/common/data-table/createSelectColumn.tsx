import { Checkbox } from "@jects/jds";
import type { RowData } from "@tanstack/react-table";

import type { DataTableColumnHelper } from "./DataTable.features";

export function createSelectColumn<TData extends RowData>(
  columnHelper: DataTableColumnHelper<TData>
) {
  return columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        size="lg"
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        disabled={!table.getRowModel().rows.some((row) => row.getCanSelect())}
        onCheckedChange={(next) => table.toggleAllRowsSelected(next === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        size="lg"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(next) => row.toggleSelected(next === true)}
      />
    ),
    meta: { cellType: "control" },
  });
}
