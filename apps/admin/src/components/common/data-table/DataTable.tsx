import type { KeyboardEvent } from "react";

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
import { DataTableReorderProvider } from "./DataTableReorderProvider";
import { DraggableRow } from "./DraggableRow";

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
    // 체크박스나 드래그 핸들을 누를 때 행 클릭이 함께 실행되지 않게 한다.
    return (
      <DataTableControlCell onClick={(event) => event.stopPropagation()}>
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
  const reorder = table.options.meta?.reorder;
  const onRowClick = table.options.meta?.onRowClick;

  const rows = table.getRowModel().rows.map((row) => {
    const rowProps = {
      selected: row.getIsSelected(),
      selectionDisabled: !row.getCanSelect(),
      onClick: onRowClick && (() => onRowClick(row.original)),
      tabIndex: onRowClick ? 0 : undefined,
      onKeyDown:
        onRowClick &&
        ((event: KeyboardEvent<HTMLTableRowElement>) => {
          // 체크박스나 드래그 핸들에서 올라온 키는 무시한다.
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onRowClick(row.original);
        }),
      // 열 숨기기 기능을 등록하지 않아 getAllCells를 쓴다. 등록하면 getVisibleCells로 바꾼다.
      children: row.getAllCells().map((cell) => <BodyCell key={cell.id} cell={cell} />),
    };

    return reorder ? (
      <DraggableRow key={row.id} id={row.id} {...rowProps} />
    ) : (
      <DataTableRow key={row.id} {...rowProps} />
    );
  });

  return (
    <DataTableRoot className={className}>
      <DataTableHeader>
        {/* DataTable은 디자인 시스템상 헤더 그룹을 제공하지 않으므로 맨 아래 헤더 그룹만 쓴다. */}
        {table
          .getHeaderGroups()
          .at(-1)
          ?.headers.map((header) => (
            <HeaderCell key={header.id} header={header} />
          ))}
      </DataTableHeader>
      <DataTableBody>
        {reorder ? <DataTableReorderProvider table={table}>{rows}</DataTableReorderProvider> : rows}
      </DataTableBody>
    </DataTableRoot>
  );
}
