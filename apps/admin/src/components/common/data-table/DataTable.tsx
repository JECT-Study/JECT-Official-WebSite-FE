import {
  type Cell,
  FlexRender,
  type Header,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";

import type { DataTableFeatures } from "./DataTable.features";
import {
  DataTableBody,
  DataTableCell,
  DataTableControlCell,
  DataTableControlHeaderItem,
  DataTableHeader,
  DataTableHeaderItem,
  DataTableRoot,
  DataTableRow,
  DataTableTitleCell,
} from "./DataTablePrimitives";

interface HeaderCellProps<TData extends RowData> {
  header: Header<DataTableFeatures<TData>, TData>;
}

function HeaderCell<TData extends RowData>({ header }: HeaderCellProps<TData>) {
  if (header.column.columnDef.meta?.cellType === "control") {
    return (
      <DataTableControlHeaderItem>
        <FlexRender header={header} />
      </DataTableControlHeaderItem>
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

  if (meta?.cellType === "control") {
    return (
      <DataTableControlCell>
        <FlexRender cell={cell} />
      </DataTableControlCell>
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

interface DataTableProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures<TData>, TData>;
  className?: string;
}

export function DataTableBase<TData extends RowData>({ table, className }: DataTableProps<TData>) {
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
            {/* 열 숨기기 기능을 등록하지 않아 getAllCells를 쓴다. 등록하면 getVisibleCells로 바꾼다. */}
            {row.getAllCells().map((cell) => (
              <BodyCell key={cell.id} cell={cell} />
            ))}
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTableRoot>
  );
}
