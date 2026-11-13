import type { Account } from "@/apis/account/schemas";
import { AccountRoleBadge } from "@/components/account/account-role-badge/AccountRoleBadge";
import { AccountStatusBadge } from "@/components/account/account-status-badge/AccountStatusBadge";
import { createDataTableColumnHelper } from "@/components/common/data-table";

const columnHelper = createDataTableColumnHelper<Account>();

export const accountColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "이름",
    cell: (info) => info.getValue() ?? "-",
    meta: { cellType: "title", getDescription: (account) => account.email },
  }),
  columnHelper.accessor("role", {
    header: "관리자 계정 유형",
    cell: (info) => <AccountRoleBadge role={info.getValue()} />,
  }),
  columnHelper.accessor("status", {
    header: "상태",
    cell: (info) => <AccountStatusBadge status={info.getValue()} />,
  }),
]);
