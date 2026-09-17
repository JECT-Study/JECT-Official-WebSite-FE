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
import { DataTableView } from "./DataTableView";

export {
  createDataTableColumnHelper,
  type DataTableColumnDef,
  type DataTableColumnHelper,
} from "./features";

export const DataTable = Object.assign(DataTableView, {
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
