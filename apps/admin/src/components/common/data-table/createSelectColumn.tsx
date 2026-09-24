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
        aria-label="전체 선택"
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(next) => table.toggleAllRowsSelected(next === true)}
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        size="lg"
        aria-label={`${table.options.meta?.getRowName?.(row.original) ?? "행"} 선택`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(next) => row.toggleSelected(next === true)}
      />
    ),
    meta: { cellType: "control" },
  });
}
