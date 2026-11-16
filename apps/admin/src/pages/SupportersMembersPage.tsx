import { useState } from "react";

import { BlockButton, ContentBadge, EmptyState, Icon, Tabs } from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";

import { supportersMemberQueries } from "@/apis/supportersMember/queries";
import type { SupportersMember } from "@/apis/supportersMember/schemas";
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/common/data-table";
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";
import { ACTIVITY_STATUS_LABELS, RECRUIT_TYPE_DETAIL_LABELS } from "@/constants/supportersMember";
import { formatPhoneNumber } from "@/utils/phoneNumber";

const columnHelper = createDataTableColumnHelper<SupportersMember>();

const EMPTY_VALUE = <span className="text-object-subtle">-</span>;

const supportersMemberColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "이름",
    cell: (info) => info.getValue() ?? "-",
    meta: {
      cellType: "title",
      getDescription: (member) =>
        member.phoneNumber === null ? null : formatPhoneNumber(member.phoneNumber),
    },
  }),
  columnHelper.accessor("jobFamily", {
    header: "포지션",
    cell: (info) => {
      const jobFamily = info.getValue();
      if (jobFamily === null) return EMPTY_VALUE;

      const { label, color } = JOB_FAMILY_BADGES[jobFamily];
      return (
        <ContentBadge variant={color} badgeStyle="alpha">
          {label}
        </ContentBadge>
      );
    },
  }),
  columnHelper.accessor("recruitTypeDetail", {
    header: "모집 단위",
    cell: (info) => RECRUIT_TYPE_DETAIL_LABELS[info.getValue()],
  }),
  columnHelper.accessor("activityStatus", {
    header: "활동 상태",
    cell: (info) => ACTIVITY_STATUS_LABELS[info.getValue()],
  }),
  columnHelper.accessor("memo", {
    header: "비고",
    cell: (info) =>
      info.getValue()?.trim() ? (
        <Icon name="file" size="lg" className="text-object-alternative" />
      ) : (
        EMPTY_VALUE
      ),
  }),
]);

const MOBILE_COLUMNS = supportersMemberColumns.slice(0, 2);

const EMPTY_MEMBERS: SupportersMember[] = [];

const getMemberRowId = (member: SupportersMember) => String(member.memberActivityId);

export default function SupportersMembersPage() {
  const { isMobile, isDesktop } = useMediaQueryFlags();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useInfiniteQuery(supportersMemberQueries.list());
  const members = data?.pages.flatMap((page) => page.content) ?? EMPTY_MEMBERS;
  const totalCount = data?.pages[0]?.totalCount;
  const selectedCount = Object.keys(rowSelection).length;
  const hasSelection = selectedCount > 0;

  const handleAddMember = () => {
    // 구성원 추가 이슈에서 드로어를 연다.
  };

  const handleDeleteMembers = () => {
    // 구성원 삭제 이슈에서 확인 다이얼로그를 연다.
  };

  const handleRowClick = () => {
    // 상세 드로어 이슈에서 연결한다.
  };

  const handleLoadMore = () => {
    // 버튼 비활성화가 다음 렌더에 반영되므로 진행 중인 요청을 취소하고 다시 보내지 않게 한다.
    void fetchNextPage({ cancelRefetch: false });
  };

  const table = useDataTable({
    data: members,
    columns: isMobile ? MOBILE_COLUMNS : supportersMemberColumns,
    getRowId: getMemberRowId,
    selection: isDesktop ? { rowSelection, onRowSelectionChange: setRowSelection } : undefined,
    rowClick: { onRowClick: handleRowClick },
  });

  return (
    <div className="flex flex-col gap-16 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <div className="flex items-center gap-16 py-12">
        <h2 className="min-w-0 flex-1 text-title-2 font-title-subtle text-object-boldest">
          구성원 목록
        </h2>
        {isDesktop && (
          <BlockButton
            hierarchy="secondary"
            variant="outlined"
            size="sm"
            prefixIcon="clock-3"
            disabled
          >
            변경 이력
          </BlockButton>
        )}
      </div>
      <div className="flex flex-col gap-12">
        {isDesktop && (
          <div className="flex items-center gap-16 rounded-10 border border-stroke-subtle bg-surface-standard px-16 py-12">
            <Tabs.Root variant="content" value="all">
              <Tabs.List>
                <Tabs.Trigger value="all" badge={totalCount}>
                  전체
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            <div className="flex items-center gap-12">
              <BlockButton
                hierarchy="primary"
                variant="solid"
                size="sm"
                prefixIcon="plus"
                onClick={handleAddMember}
              >
                구성원 추가
              </BlockButton>
              {hasSelection && (
                <span className="text-label-md text-accent-neutral">{selectedCount}개 선택됨</span>
              )}
            </div>
            {hasSelection && (
              <BlockButton
                feedback="destructive"
                size="sm"
                prefixIcon="trash"
                className="ml-auto"
                onClick={handleDeleteMembers}
              >
                삭제
              </BlockButton>
            )}
          </div>
        )}
        {isPending ? (
          <EmptyState body="구성원 목록을 불러오는 중입니다." />
        ) : members.length === 0 && isError ? (
          <EmptyState
            body="목록을 불러오지 못했습니다."
            primaryAction={{ children: "다시 시도", onClick: () => void refetch() }}
          />
        ) : members.length === 0 ? (
          <EmptyState body="등록된 구성원이 없습니다." />
        ) : (
          <>
            <DataTable table={table} />
            {hasNextPage && (
              <BlockButton
                hierarchy="primary"
                variant="hollow"
                size="md"
                suffixIcon="chevron-down"
                className="self-center"
                disabled={isFetchingNextPage}
                onClick={handleLoadMore}
              >
                목록 더보기
              </BlockButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
