import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";

import type { Account } from "@/apis/account/schemas";
import { DataTable, useDataTable } from "@/components/common/data-table";

import { accountColumns } from "./AccountTable.columns";

interface AccountTableProps {
  accounts: Account[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onRowClick: (account: Account) => void;
}

const getAccountRowId = (account: Account) => String(account.id);

export function AccountTable({
  accounts,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
}: AccountTableProps) {
  const table = useDataTable({
    data: accounts,
    columns: accountColumns,
    getRowId: getAccountRowId,
    selection: { rowSelection, onRowSelectionChange },
    rowClick: { onRowClick },
  });

  return <DataTable table={table} />;
}
