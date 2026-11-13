import { useRef, useState } from "react";

import { EmptyState, Pagination } from "@jects/jds";
import type { RowSelectionState } from "@tanstack/react-table";

import { AccountListToolbar } from "@/components/account/account-list-toolbar/AccountListToolbar";
import { AccountTable } from "@/components/account/account-table/AccountTable";
import { DeactivateAccountsDialog } from "@/components/account/deactivate-accounts-dialog/DeactivateAccountsDialog";
import Filter from "@/components/common/filter/Filter";
import type { FilterValues } from "@/components/common/filter/Filter.types";
import { useAccountsQuery } from "@/hooks/account/useAccountsQuery";
import { useDeactivateAccountsMutation } from "@/hooks/account/useDeactivateAccountsMutation";
import { useAuthStore } from "@/stores/useAuthStore";

import { ACCOUNT_FILTER_FIELDS, toAccountListFilter } from "./AccountsPage.filter";

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

  return (
    <div className="flex flex-col gap-20 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <h2 className="text-title-2 font-title-bold text-object-boldest">관리자 계정 목록</h2>
      <AccountListToolbar
        // TODO: 백엔드가 필터와 무관한 전체 수 필드를 추가하면 교체한다.
        totalCount={data?.totalElements}
        canAddAccount={isAdmin}
        onAddAccount={handleAddAccount}
        selectedCount={selectedIds.length}
        onDeactivate={handleOpenDeactivateDialog}
      >
        <Filter
          fields={ACCOUNT_FILTER_FIELDS}
          values={filterValues}
          onValuesChange={handleFilterChange}
        />
      </AccountListToolbar>
      {isError ? (
        <EmptyState
          body="목록을 불러오지 못했습니다."
          primaryAction={{ children: "다시 시도", onClick: () => void refetch() }}
          secondaryAction={
            page > 0 ? { children: "첫 페이지로 이동", onClick: () => setPage(0) } : undefined
          }
        />
      ) : isPending ? null : data.content.length === 0 ? (
        <EmptyState body="조건에 맞는 계정이 없습니다." />
      ) : (
        <>
          <AccountTable
            accounts={data.content}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            onRowClick={handleRowClick}
          />
          {data.totalPages > 1 && (
            <Pagination
              className="self-center"
              page={page + 1}
              totalPages={data.totalPages}
              onPageChange={(next) => setPage(next - 1)}
            />
          )}
        </>
      )}
      <DeactivateAccountsDialog
        open={isDeactivateDialogOpen}
        count={deactivateTargetIds.length}
        isPending={isDeactivating}
        onOpenChange={setIsDeactivateDialogOpen}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
