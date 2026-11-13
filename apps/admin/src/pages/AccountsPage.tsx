import { useState } from "react";

import { EmptyState, Pagination } from "@jects/jds";

import { AccountListToolbar } from "@/components/account/account-list-toolbar/AccountListToolbar";
import { AccountTable } from "@/components/account/account-table/AccountTable";
import Filter from "@/components/common/filter/Filter";
import type { FilterValues } from "@/components/common/filter/Filter.types";
import { useAccountsQuery } from "@/hooks/account/useAccountsQuery";
import { useAuthStore } from "@/stores/useAuthStore";

import { ACCOUNT_FILTER_FIELDS, toAccountListFilter } from "./AccountsPage.filter";

export default function AccountsPage() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [page, setPage] = useState(0);
  const { data, isPending, isError, isPlaceholderData, refetch } = useAccountsQuery({
    ...toAccountListFilter(filterValues),
    page,
  });

  // 비활성화 등으로 현재 페이지가 사라지면 마지막 페이지로 옮긴다.
  if (data && !isPlaceholderData && data.totalPages > 0 && page >= data.totalPages) {
    setPage(data.totalPages - 1);
  }

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
    setPage(0);
  };

  const handleAddAccount = () => {
    // #77에서 계정 추가 드로어를 연다.
  };

  const handleRowClick = () => {
    // 상세 드로어 이슈에서 연결한다.
  };

  return (
    <div className="flex flex-col gap-20 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <h2 className="text-title-4 font-title-bold text-object-boldest">관리자 계정 목록</h2>
      <AccountListToolbar
        // TODO: 백엔드가 필터와 무관한 전체 수 필드를 추가하면 교체한다.
        totalCount={data?.totalElements}
        canAddAccount={isAdmin}
        onAddAccount={handleAddAccount}
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
        />
      ) : isPending ? null : data.content.length === 0 ? (
        <EmptyState body="조건에 맞는 계정이 없습니다." />
      ) : (
        <>
          <AccountTable accounts={data.content} onRowClick={handleRowClick} />
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
    </div>
  );
}
