import { DataTableBase } from "./DataTable";
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

export {
  createDataTableColumnHelper,
  type DataTableColumnDef,
  type DataTableColumnHelper,
} from "./features";
export { useDataTable } from "./useDataTable";

export const DataTable = Object.assign(DataTableBase, {
  Root: DataTableRoot,
  Header: DataTableHeader,
  HeaderItem: DataTableHeaderItem,
  ControlHeaderItem: DataTableControlHeaderItem,
  Body: DataTableBody,
  Row: DataTableRow,
  TitleCell: DataTableTitleCell,
  Cell: DataTableCell,
  ControlCell: DataTableControlCell,
});
