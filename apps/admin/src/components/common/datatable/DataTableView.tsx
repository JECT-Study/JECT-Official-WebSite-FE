import {
  type Cell,
  FlexRender,
  type Header,
  type ReactTable,
  type RowData,
  type TableFeatures,
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
import type { DataTableColumnMeta } from "./types";

// 제네릭 안에서는 columnMeta 슬롯의 조건부 타입이 풀리지 않는다. 타입 매개변수 제약으로 등록을 보장하고 여기서만 좁힌다.
function readMeta<TData>(meta: object | undefined) {
  return meta as DataTableColumnMeta<TData> | undefined;
}

type DataTableFeatures<TData extends RowData> = TableFeatures & {
  columnMeta: DataTableColumnMeta<TData>;
};

interface HeaderCellProps<TFeatures extends DataTableFeatures<TData>, TData extends RowData> {
  header: Header<TFeatures, TData>;
}

function HeaderCell<TFeatures extends DataTableFeatures<TData>, TData extends RowData>({
  header,
}: HeaderCellProps<TFeatures, TData>) {
  const { isCheckbox } = readMeta<TData>(header.column.columnDef.meta) ?? {};

  if (isCheckbox) {
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

interface BodyCellProps<TFeatures extends DataTableFeatures<TData>, TData extends RowData> {
  cell: Cell<TFeatures, TData>;
}

function BodyCell<TFeatures extends DataTableFeatures<TData>, TData extends RowData>({
  cell,
}: BodyCellProps<TFeatures, TData>) {
  const { titleDescription, isCheckbox } = readMeta<TData>(cell.column.columnDef.meta) ?? {};

  if (isCheckbox) {
    return (
      <DataTableCheckboxCell>
        <FlexRender cell={cell} />
      </DataTableCheckboxCell>
    );
  }

  if (titleDescription) {
    return (
      <DataTableTitleCell description={titleDescription(cell.row.original)}>
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

interface DataTableViewProps<TFeatures extends DataTableFeatures<TData>, TData extends RowData> {
  table: ReactTable<TFeatures, TData>;
  className?: string;
}

export function DataTableView<TFeatures extends DataTableFeatures<TData>, TData extends RowData>({
  table,
  className,
}: DataTableViewProps<TFeatures, TData>) {
  return (
    <DataTableRoot className={className}>
      <DataTableHeader>
        {table.getHeaderGroups()[0].headers.map((header) => (
          <HeaderCell key={header.id} header={header} />
        ))}
      </DataTableHeader>
      <DataTableBody>
        {table.getRowModel().rows.map((row) => (
          <DataTableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <BodyCell key={cell.id} cell={cell} />
            ))}
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTableRoot>
  );
}
