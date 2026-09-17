import {
  type Cell,
  FlexRender,
  type Header,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";

import {
  DataTableBody,
  DataTableCell,
  DataTableCheckboxCell,
  DataTableCheckboxHeaderItem,
  DataTableHeader,
  DataTableHeaderItem,
  DataTableRoot,
  DataTableRow,
  DataTableTitleCell,
} from "./DataTable";
import type { DataTableFeatures } from "./features";

interface HeaderCellProps<TData extends RowData> {
  header: Header<DataTableFeatures<TData>, TData>;
}

function HeaderCell<TData extends RowData>({ header }: HeaderCellProps<TData>) {
  if (header.column.columnDef.meta?.cellType === "checkbox") {
    return (
      <DataTableCheckboxHeaderItem>
        <FlexRender header={header} />
      </DataTableCheckboxHeaderItem>
    );
  }

  return (
    <DataTableHeaderItem>
      <FlexRender header={header} />
    </DataTableHeaderItem>
  );
}

interface BodyCellProps<TData extends RowData> {
  cell: Cell<DataTableFeatures<TData>, TData>;
}

function BodyCell<TData extends RowData>({ cell }: BodyCellProps<TData>) {
  const meta = cell.column.columnDef.meta;

  if (meta?.cellType === "checkbox") {
    return (
      <DataTableCheckboxCell>
        <FlexRender cell={cell} />
      </DataTableCheckboxCell>
    );
  }

  if (meta?.cellType === "title") {
    return (
      <DataTableTitleCell description={meta.getDescription(cell.row.original)}>
        <FlexRender cell={cell} />
      </DataTableTitleCell>
    );
  }

  return (
    <DataTableCell>
      <FlexRender cell={cell} />
    </DataTableCell>
  );
}

interface DataTableViewProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures<TData>, TData>;
  className?: string;
}

export function DataTableView<TData extends RowData>({
  table,
  className,
}: DataTableViewProps<TData>) {
  return (
    <DataTableRoot className={className}>
      <DataTableHeader>
        {table.getHeaderGroups()[0].headers.map((header) => (
          <HeaderCell key={header.id} header={header} />
        ))}
      </DataTableHeader>
      <DataTableBody>
        {table.getRowModel().rows.map((row) => (
          <DataTableRow key={row.id} selected={row.getIsSelected()} disabled={!row.getCanSelect()}>
            {/* 열 숨기기 기능을 등록하지 않아 모든 셀이 보이는 셀이다. 등록하면 getVisibleCells로 바꾼다. */}
            {row.getAllCells().map((cell) => (
              <BodyCell key={cell.id} cell={cell} />
            ))}
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTableRoot>
  );
}
