import { useRef, useState } from "react";

import {
  BlockButton,
  ContentBadge,
  EmptyState,
  Pagination,
  Tabs,
  type ThemeVariant,
} from "@jects/jds";
import { keepPreviousData, useIsMutating, useQuery } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";

import type { AccountListParams } from "@/apis/account/api";
import { accountMutationKeys, accountQueries } from "@/apis/account/queries";
import type { Account } from "@/apis/account/schemas";
import {
  createDataTableColumnHelper,
  DataTable,
  deselectRows,
  useDataTable,
} from "@/components/common/data-table";
import Filter from "@/components/common/filter/Filter";
import type {
  FilterField,
  FilterOptionValue,
  FilterValues,
} from "@/components/common/filter/Filter.types";
import {
  ACCOUNT_ROLE_LABELS,
  ACCOUNT_ROLES,
  ACCOUNT_STATUS_LABELS,
  ACCOUNT_STATUSES,
  type AccountRole,
} from "@/constants/account";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { useDeactivateAccountsMutation } from "@/hooks/account/useDeactivateAccountsMutation";
import { showDialog } from "@/stores/dialogStore";
import { useAuthStore } from "@/stores/useAuthStore";

const ACCOUNT_FILTER_FIELDS: FilterField[] = [
  {
    id: "role",
    label: "계정 유형",
    options: ACCOUNT_ROLES.map((role) => ({ value: role, label: ACCOUNT_ROLE_LABELS[role] })),
  },
  {
    id: "status",
    label: "상태",
    options: ACCOUNT_STATUSES.map((status) => ({
      value: status,
      label: ACCOUNT_STATUS_LABELS[status],
    })),
  },
];

function pickAllowed<T extends string>(allowed: readonly T[], selected: FilterOptionValue[] = []) {
  return allowed.filter((value) => selected.includes(value));
}

function toAccountListFilter(values: FilterValues): Pick<AccountListParams, "roles" | "statuses"> {
  return {
    roles: pickAllowed(ACCOUNT_ROLES, values.role),
    statuses: pickAllowed(ACCOUNT_STATUSES, values.status),
  };
}

const ROLE_VARIANTS: Record<AccountRole, ThemeVariant> = {
  ADMIN: "teal",
  OPERATIONS: "lime",
  SUPPORTER: "purple",
};

const columnHelper = createDataTableColumnHelper<Account>();

const accountColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "이름",
    cell: (info) => info.getValue() ?? "-",
    meta: { cellType: "title", getDescription: (account) => account.email },
  }),
  columnHelper.accessor("role", {
    header: "관리자 계정 유형",
    cell: (info) => (
      <ContentBadge variant={ROLE_VARIANTS[info.getValue()]} badgeStyle="alpha">
        {ACCOUNT_ROLE_LABELS[info.getValue()]}
      </ContentBadge>
    ),
  }),
  columnHelper.accessor("status", {
    header: "상태",
    cell: (info) => (
      <ContentBadge
        hierarchy={info.getValue() === "ACTIVE" ? "primary" : "secondary"}
        badgeStyle="solid"
      >
        {ACCOUNT_STATUS_LABELS[info.getValue()]}
      </ContentBadge>
    ),
  }),
]);

const EMPTY_ACCOUNTS: Account[] = [];

const getAccountRowId = (account: Account) => String(account.id);

export default function AccountsPage() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [page, setPage] = useState(0);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, error, isPending, isError, isPlaceholderData, refetch } = useQuery({
    ...accountQueries.list({ ...toAccountListFilter(filterValues), page }),
    placeholderData: keepPreviousData,
  });
  const { mutateAsync: deactivateAccounts } = useDeactivateAccountsMutation();
  const isDeactivating = useIsMutating({ mutationKey: accountMutationKeys.deactivate() }) > 0;
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIds = Object.keys(rowSelection).map(Number);
  const hasSelection = selectedIds.length > 0;
  const isEmpty = data?.content.length === 0;
  const isFirstPage = page === 0;
  // TODO: 목록 조회부터 ADMIN만 허용하므로 권한 라우트를 두어 진입 전에 다른 화면으로 이동시킨다.
  const isForbidden = hasErrorCode(error, "GLOBAL-7");
  // 이전 페이지 행이 보이는 동안 선택하면 화면에 없는 계정이 비활성화 대상이 되므로 막는다.
  const canSelectAccount = (account: Account) => !isPlaceholderData && account.status === "ACTIVE";

  // 비활성화 등으로 현재 페이지가 사라지면 마지막 페이지로 옮긴다.
  if (data && !isPlaceholderData && data.totalPages > 0 && page >= data.totalPages) {
    setPage(data.totalPages - 1);
  }

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
    setPage(0);
    setRowSelection({});
  };

  const handleOpenDeactivateDialog = () => {
    const ids = selectedIds;
    void showDialog(DIALOG_CONTENT.deactivateAccounts(ids.length), {
      onPrimaryClick: () =>
        deactivateAccounts(ids, {
          // 요청 중에 새로 선택한 계정은 남기도록 요청한 계정만 선택에서 뺀다.
          onSuccess: () => setRowSelection((prev) => deselectRows(prev, ids)),
        }),
      fallbackFocusRef: listRef,
    });
  };

  const handleAddAccount = () => {
    // #77에서 계정 추가 드로어를 연다.
  };

  const handleRowClick = () => {
    // 상세 드로어 이슈에서 연결한다.
  };

  const table = useDataTable({
    data: data?.content ?? EMPTY_ACCOUNTS,
    columns: accountColumns,
    getRowId: getAccountRowId,
    selection: { rowSelection, onRowSelectionChange: setRowSelection, canSelect: canSelectAccount },
    rowClick: { onRowClick: handleRowClick },
  });

  return (
    <div className="flex flex-col gap-16 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <h2 className="py-12 text-title-2 font-title-subtle text-object-boldest">관리자 계정 목록</h2>
      <div className="rounded-10 border border-stroke-subtle bg-surface-standard">
        <div className="flex items-center gap-16 px-16 py-12">
          <Tabs.Root variant="content" value="all">
            <Tabs.List>
              {/* TODO: 백엔드가 필터와 무관한 전체 수 필드를 추가하면 교체한다. */}
              <Tabs.Trigger value="all" badge={data?.totalElements}>
                전체
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
          <div className="flex items-center gap-12">
            {isAdmin && (
              <BlockButton
                hierarchy="primary"
                variant="solid"
                size="sm"
                prefixIcon="plus"
                onClick={handleAddAccount}
              >
                계정 추가
              </BlockButton>
            )}
            {hasSelection && (
              <span className="text-label-md text-accent-neutral">
                {selectedIds.length}개 선택됨
              </span>
            )}
          </div>
          {hasSelection && (
            <BlockButton
              hierarchy="secondary"
              variant="outlined"
              size="sm"
              className="ml-auto"
              disabled={isDeactivating}
              onClick={handleOpenDeactivateDialog}
            >
              비활성화
            </BlockButton>
          )}
        </div>
        <div className="border-t border-stroke-subtle px-16 py-12">
          <Filter
            fields={ACCOUNT_FILTER_FIELDS}
            values={filterValues}
            onValuesChange={handleFilterChange}
          />
        </div>
      </div>
      <div ref={listRef} tabIndex={-1} className="flex flex-col gap-16 outline-none">
        {isForbidden ? (
          <EmptyState body="계정 목록을 조회할 권한이 없습니다." />
        ) : isError ? (
          <EmptyState
            body="목록을 불러오지 못했습니다."
            primaryAction={{ children: "다시 시도", onClick: () => void refetch() }}
            secondaryAction={
              isFirstPage ? undefined : { children: "첫 페이지로 이동", onClick: () => setPage(0) }
            }
          />
        ) : isPending ? null : isEmpty ? (
          <EmptyState body="조건에 맞는 계정이 없습니다." />
        ) : (
          <>
            <DataTable table={table} />
            <Pagination
              className="self-center"
              page={page + 1}
              totalPages={data.totalPages}
              onPageChange={(next) => setPage(next - 1)}
            />
          </>
        )}
      </div>
    </div>
  );
}
