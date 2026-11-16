import { useState } from "react";

import { BlockButton, ContentBadge, EmptyState, Icon, Tabs, useToast } from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";

import { makersMemberQueries } from "@/apis/makersMember/queries";
import type { MakersMember, MakersMemberPage } from "@/apis/makersMember/schemas";
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/common/data-table";
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";
import {
  ACTIVITY_STATUS_LABELS,
  MAKERS_TEAM_LABELS,
  RECRUIT_TYPE_DETAIL_LABELS,
} from "@/constants/makersMember";

function formatPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  return phoneNumber;
}

const columnHelper = createDataTableColumnHelper<MakersMember>();

const emptyCell = <span className="text-object-subtle">-</span>;

const nameColumn = columnHelper.accessor("name", {
  header: "이름",
  cell: (info) => info.getValue() ?? "-",
  meta: {
    cellType: "title",
    getDescription: (member) => member.phoneNumber && formatPhoneNumber(member.phoneNumber),
  },
});

const jobFamilyColumn = columnHelper.accessor("jobFamily", {
  header: "포지션",
  cell: (info) => {
    const jobFamily = info.getValue();
    if (!jobFamily) return emptyCell;

    const { label, color } = JOB_FAMILY_BADGES[jobFamily];
    return (
      <ContentBadge variant={color} badgeStyle="alpha">
        {label}
      </ContentBadge>
    );
  },
});

const desktopColumns = columnHelper.columns([
  nameColumn,
  jobFamilyColumn,
  columnHelper.accessor("makersTeam", {
    header: "소속",
    cell: (info) => {
      const makersTeam = info.getValue();
      return makersTeam ? MAKERS_TEAM_LABELS[makersTeam] : emptyCell;
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
        <Icon name="sticky-note" size="md" className="text-object-alternative" />
      ) : (
        emptyCell
      ),
  }),
]);

const mobileColumns = columnHelper.columns([nameColumn, jobFamilyColumn]);

interface MakersMemberList {
  members: MakersMember[];
  totalCount: number;
}

function selectMakersMemberList(data: InfiniteData<MakersMemberPage>): MakersMemberList {
  return {
    members: data.pages.flatMap((page) => page.content),
    totalCount: data.pages[0]?.totalCount ?? 0,
  };
}

const EMPTY_MEMBERS: MakersMember[] = [];

const getMemberRowId = (member: MakersMember) => String(member.memberActivityId);

export default function MakersMembersPage() {
  const { isMobile, isDesktop } = useMediaQueryFlags();
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, isPending, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({ ...makersMemberQueries.list(), select: selectMakersMemberList });
  const selectedCount = Object.keys(rowSelection).length;
  const hasSelection = selectedCount > 0;

  const handleFetchNextPage = async () => {
    // 버튼 비활성화가 반영되기 전의 연속 클릭은 진행 중인 요청을 재사용해 중복 요청을 막는다.
    const result = await fetchNextPage({ cancelRefetch: false });
    if (result.isFetchNextPageError) toast.destructive("목록을 더 불러오지 못했습니다.");
  };

  const handleAddMember = () => {
    // 구성원 추가 드로어 이슈에서 연결한다.
  };

  const handleDeleteMembers = () => {
    // 구성원 삭제 이슈에서 연결한다.
  };

  const handleRowClick = () => {
    // 상세 드로어 이슈에서 연결한다.
  };

  const table = useDataTable({
    data: data?.members ?? EMPTY_MEMBERS,
    columns: isMobile ? mobileColumns : desktopColumns,
    getRowId: getMemberRowId,
    selection: isDesktop ? { rowSelection, onRowSelectionChange: setRowSelection } : undefined,
    rowClick: { onRowClick: handleRowClick },
  });

  return (
    <div className="flex flex-col gap-16 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <div className="flex items-center gap-28 py-12">
        <h2 className="min-w-0 flex-1 text-title-2 font-title-subtle text-object-boldest">
          구성원 목록
        </h2>
        {/* 변경 이력 화면이 준비되면 연결한다. */}
        <BlockButton
          hierarchy="primary"
          variant="outlined"
          size="sm"
          prefixIcon="clock-3"
          disabled
          className="hidden desktop:inline-flex"
        >
          변경 이력
        </BlockButton>
      </div>
      <div className="hidden items-center gap-16 rounded-10 border border-stroke-subtle bg-surface-standard px-16 py-12 desktop:flex">
        <Tabs.Root variant="content" value="all">
          <Tabs.List>
            <Tabs.Trigger value="all" badge={data?.totalCount}>
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
            hierarchy="secondary"
            variant="outlined"
            size="sm"
            className="ml-auto"
            onClick={handleDeleteMembers}
          >
            삭제
          </BlockButton>
        )}
      </div>
      {isPending ? (
        <EmptyState header="구성원 목록을 불러오는 중입니다" body="잠시만 기다려 주세요." />
      ) : !data ? (
        <EmptyState
          body="목록을 불러오지 못했습니다."
          primaryAction={{ children: "다시 시도", onClick: () => void refetch() }}
        />
      ) : data.members.length === 0 ? (
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
              disabled={isFetchingNextPage}
              className="self-center"
              onClick={() => void handleFetchNextPage()}
            >
              목록 더보기
            </BlockButton>
          )}
        </>
      )}
    </div>
  );
}
