import type { Account } from "@/apis/account/schemas";
import { DataTable, useDataTable } from "@/components/common/data-table";

import { accountColumns } from "./AccountTable.columns";

interface AccountTableProps {
  accounts: Account[];
  onRowClick: (account: Account) => void;
}

const getAccountRowId = (account: Account) => String(account.id);

export function AccountTable({ accounts, onRowClick }: AccountTableProps) {
  const table = useDataTable({
    data: accounts,
    columns: accountColumns,
    getRowId: getAccountRowId,
    rowClick: { onRowClick },
  });

  return <DataTable table={table} />;
}
