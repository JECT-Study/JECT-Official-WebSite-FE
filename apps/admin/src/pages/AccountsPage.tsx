import { EmptyState } from "@jects/jds";

import type { AccountListParams } from "@/apis/account/query";
import { AccountListToolbar } from "@/components/account/account-list-toolbar/AccountListToolbar";
import { AccountTable } from "@/components/account/account-table/AccountTable";
import { useAccountsQuery } from "@/hooks/account/useAccountsQuery";
import { useAuthStore } from "@/stores/useAuthStore";

const params: AccountListParams = { roles: [], statuses: [], page: 0 };

export default function AccountsPage() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const { data, isPending, isError, refetch } = useAccountsQuery(params);

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
      />
      {isError ? (
        <EmptyState
          body="목록을 불러오지 못했습니다."
          primaryAction={{ children: "다시 시도", onClick: () => void refetch() }}
        />
      ) : isPending ? null : data.content.length === 0 ? (
        <EmptyState body="조건에 맞는 계정이 없습니다." />
      ) : (
        <AccountTable accounts={data.content} onRowClick={handleRowClick} />
      )}
    </div>
  );
}
