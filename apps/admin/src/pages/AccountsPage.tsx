import { useRef, useState } from "react";

import {
  BlockButton,
  ContentBadge,
  Dialog,
  EmptyState,
  NumericBadge,
  Pagination,
  type ThemeVariant,
} from "@jects/jds";
import type { RowSelectionState } from "@tanstack/react-table";

import type { AccountListParams } from "@/apis/account/query";
import type { Account } from "@/apis/account/schemas";
import {
  createDataTableColumnHelper,
  DataTable,
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
import { useAccountsQuery } from "@/hooks/account/useAccountsQuery";
import { useDeactivateAccountsMutation } from "@/hooks/account/useDeactivateAccountsMutation";
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

// Figma의 cyan, fuchsia가 JDS 0.8.0에 없어 가장 가까운 teal, pink를 쓴다. JDS에 추가되면 교체한다.
const ROLE_VARIANTS: Record<AccountRole, ThemeVariant> = {
  ADMIN: "teal",
  OPERATIONS: "lime",
  SUPPORTER: "pink",
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
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  // 닫히는 동안 선택이 비워져도 다이얼로그 문구가 바뀌지 않도록 열 때의 대상을 따로 보관한다.
  const [deactivateTargetIds, setDeactivateTargetIds] = useState<number[]>([]);
  const { data, isPending, isError, isPlaceholderData, refetch } = useAccountsQuery({
    ...toAccountListFilter(filterValues),
    page,
  });
  const { mutate: deactivateAccounts, isPending: isDeactivating } = useDeactivateAccountsMutation();
  const isDeactivatingRef = useRef(false);
  const selectedIds = Object.keys(rowSelection).map(Number);
  const hasSelection = selectedIds.length > 0;
  const isEmpty = data?.content.length === 0;
  const hasMultiplePages = (data?.totalPages ?? 0) > 1;
  const isFirstPage = page === 0;

  // 비활성화 등으로 현재 페이지가 사라지면 마지막 페이지로 옮긴다.
  if (data && !isPlaceholderData && data.totalPages > 0 && page >= data.totalPages) {
    setPage(data.totalPages - 1);
  }

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
    setPage(0);
    setRowSelection({});
  };

  const handleConfirmDeactivate = () => {
    // isPending은 다음 렌더에 반영되어 연속 클릭을 막지 못하므로 ref로 즉시 잠근다.
    if (isDeactivatingRef.current || deactivateTargetIds.length === 0) return;
    isDeactivatingRef.current = true;
    deactivateAccounts(deactivateTargetIds, {
      onSuccess: () => {
        setRowSelection({});
        setIsDeactivateDialogOpen(false);
      },
      onSettled: () => {
        isDeactivatingRef.current = false;
      },
    });
  };

  const handleOpenDeactivateDialog = () => {
    setDeactivateTargetIds(selectedIds);
    setIsDeactivateDialogOpen(true);
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
    selection: { rowSelection, onRowSelectionChange: setRowSelection },
    rowClick: { onRowClick: handleRowClick },
  });

  return (
    <div className="flex flex-col gap-20 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <h2 className="text-title-2 font-title-bold text-object-boldest">관리자 계정 목록</h2>
      <div className="rounded-10 border border-stroke-subtle bg-surface-standard">
        <div className="flex items-center gap-12 px-16 py-12">
          <div className="flex items-center gap-6 text-label-md text-object-neutral">
            <span>전체</span>
            {/* TODO: 백엔드가 필터와 무관한 전체 수 필드를 추가하면 교체한다. */}
            {data && (
              <NumericBadge hierarchy="tertiary" badgeStyle="hollow" size="md">
                {data.totalElements}
              </NumericBadge>
            )}
          </div>
          {isAdmin && (
            <BlockButton
              hierarchy="primary"
              variant="solid"
              size="xs"
              prefixIcon="plus"
              onClick={handleAddAccount}
            >
              계정 추가
            </BlockButton>
          )}
          {hasSelection && (
            <>
              <span className="text-label-md text-accent-neutral">
                {selectedIds.length}개 선택됨
              </span>
              <BlockButton
                hierarchy="secondary"
                variant="outlined"
                size="xs"
                className="ml-auto"
                onClick={handleOpenDeactivateDialog}
              >
                비활성화
              </BlockButton>
            </>
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
      {isError ? (
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
          {hasMultiplePages && (
            <Pagination
              className="self-center"
              page={page + 1}
              totalPages={data.totalPages}
              onPageChange={(next) => setPage(next - 1)}
            />
          )}
        </>
      )}
      <Dialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
        header={`계정 ${deactivateTargetIds.length}개를 비활성화하시겠습니까?`}
        body="비활성화한 계정은 백오피스에 로그인할 수 없습니다."
        primaryAction={{
          children: "비활성화",
          onClick: handleConfirmDeactivate,
          disabled: isDeactivating,
        }}
        secondaryAction={{ children: "취소", onClick: () => setIsDeactivateDialogOpen(false) }}
      />
    </div>
  );
}
