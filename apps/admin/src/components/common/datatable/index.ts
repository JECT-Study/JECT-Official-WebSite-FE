import { DataTableBase } from "./DataTable";
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
  CheckboxHeaderItem: DataTableCheckboxHeaderItem,
  Body: DataTableBody,
  Row: DataTableRow,
  TitleCell: DataTableTitleCell,
  Cell: DataTableCell,
  CheckboxCell: DataTableCheckboxCell,
});
