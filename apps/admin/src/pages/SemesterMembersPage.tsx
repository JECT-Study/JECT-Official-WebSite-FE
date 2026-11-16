import { useState } from "react";

import { BlockButton, ContentBadge, EmptyState, Tabs, useToast } from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";

import { semesterQueries } from "@/apis/semester/queries";
import type { Semester } from "@/apis/semester/schemas";
import type { SemesterMemberListFilter } from "@/apis/semesterMember/api";
import { semesterMemberQueries } from "@/apis/semesterMember/queries";
import type { SemesterMember } from "@/apis/semesterMember/schemas";
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
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";
import {
  ACTIVITY_STATUS_LABELS,
  CAREER_DETAILS_LABELS,
  EXPERIENCE_PERIOD_LABELS,
  RECRUIT_TYPE_DETAIL_LABELS,
  RECRUIT_TYPE_DETAILS,
  SEMESTER_MEMBER_ACTIVITY_STATUSES,
  SEMESTER_MEMBER_JOB_FAMILIES,
} from "@/constants/semesterMember";

const ENUM_FILTER_FIELDS: FilterField[] = [
  {
    id: "jobFamily",
    label: "포지션",
    selectionMode: "single",
    options: SEMESTER_MEMBER_JOB_FAMILIES.map((jobFamily) => ({
      value: jobFamily,
      label: JOB_FAMILY_BADGES[jobFamily].label,
    })),
  },
  {
    id: "recruitTypeDetail",
    label: "모집 단위",
    selectionMode: "single",
    options: RECRUIT_TYPE_DETAILS.map((detail) => ({
      value: detail,
      label: RECRUIT_TYPE_DETAIL_LABELS[detail],
    })),
  },
  {
    id: "status",
    label: "활동 상태",
    selectionMode: "single",
    options: SEMESTER_MEMBER_ACTIVITY_STATUSES.map((status) => ({
      value: status,
      label: ACTIVITY_STATUS_LABELS[status],
    })),
  },
];

// Filter가 받지 못한 옵션의 선택값을 버리므로 기수 필터는 목록을 받은 뒤에 추가한다.
function createFilterFields(semesters: Semester[] | undefined): FilterField[] {
  if (!semesters) return ENUM_FILTER_FIELDS;

  return [
    {
      id: "semester",
      label: "기수",
      selectionMode: "single",
      options: semesters.map(({ id, name }) => ({ value: id, label: name })),
    },
    ...ENUM_FILTER_FIELDS,
  ];
}

function pickFirstAllowed<T extends string>(
  allowed: readonly T[],
  selected: FilterOptionValue[] = []
) {
  return allowed.find((value) => selected.includes(value));
}

function toSemesterMemberListFilter(values: FilterValues): SemesterMemberListFilter {
  const semesterId = values.semester?.[0];

  return {
    semesterId: typeof semesterId === "number" ? semesterId : undefined,
    jobFamily: pickFirstAllowed(SEMESTER_MEMBER_JOB_FAMILIES, values.jobFamily),
    recruitTypeDetail: pickFirstAllowed(RECRUIT_TYPE_DETAILS, values.recruitTypeDetail),
    status: pickFirstAllowed(SEMESTER_MEMBER_ACTIVITY_STATUSES, values.status),
  };
}

function formatPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  return phoneNumber;
}

const columnHelper = createDataTableColumnHelper<SemesterMember>();

const nameColumn = columnHelper.accessor("name", {
  header: "이름",
  cell: (info) => info.getValue() ?? "-",
  meta: {
    cellType: "title",
    getDescription: ({ phoneNumber }) => (phoneNumber ? formatPhoneNumber(phoneNumber) : null),
  },
});

const jobFamilyColumn = columnHelper.accessor("jobFamily", {
  header: "포지션",
  cell: (info) => {
    const jobFamily = info.getValue();
    if (!jobFamily) return "-";

    const { label, color } = JOB_FAMILY_BADGES[jobFamily];
    return (
      <ContentBadge variant={color} badgeStyle="alpha">
        {label}
      </ContentBadge>
    );
  },
});

const semesterMemberColumns = columnHelper.columns([
  nameColumn,
  jobFamilyColumn,
  columnHelper.accessor("careerDetails", {
    header: "구성원 신분",
    cell: (info) => {
      const value = info.getValue();
      return value ? CAREER_DETAILS_LABELS[value] : "-";
    },
  }),
  columnHelper.accessor("experiencePeriod", {
    header: "직무 관련 경험 기간",
    cell: (info) => {
      const value = info.getValue();
      return value ? EXPERIENCE_PERIOD_LABELS[value] : "-";
    },
  }),
  columnHelper.accessor("status", {
    header: "활동 상태",
    cell: (info) => ACTIVITY_STATUS_LABELS[info.getValue()],
  }),
  columnHelper.display({
    id: "memo",
    header: "비고",
    // TODO: 목록 응답에 비고가 추가되면 내용이 있을 때 sticky-note 아이콘을 표시한다.
    cell: () => <span className="text-object-alternative">-</span>,
  }),
]);

const mobileSemesterMemberColumns = columnHelper.columns([nameColumn, jobFamilyColumn]);

const EMPTY_MEMBERS: SemesterMember[] = [];

const getSemesterMemberRowId = (member: SemesterMember) => String(member.memberActivityId);

export default function SemesterMembersPage() {
  const { toast } = useToast();
  const { isMobile, isDesktop } = useMediaQueryFlags();
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data: semesters } = useQuery(semesterQueries.list());
  const filter = toSemesterMemberListFilter(filterValues);
  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    ...semesterMemberQueries.list(filter),
    placeholderData: keepPreviousData,
  });
  const members = data?.pages.flatMap((page) => page.content) ?? EMPTY_MEMBERS;
  const totalCount = data?.pages[0]?.totalCount;
  const selectedCount = Object.keys(rowSelection).length;
  const isFiltered = Object.values(filter).some((value) => value !== undefined);
  // 이전 필터의 행이 보이는 동안 선택하면 화면에 없는 구성원이 선택되므로 막는다.
  const canSelectMember = () => !isPlaceholderData;

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
    setRowSelection({});
  };

  const handleLoadMore = async () => {
    const result = await fetchNextPage();
    if (result.isError) toast.destructive("목록을 더 불러오지 못했습니다.");
  };

  const table = useDataTable({
    data: members,
    columns: isMobile ? mobileSemesterMemberColumns : semesterMemberColumns,
    getRowId: getSemesterMemberRowId,
    selection: isDesktop
      ? { rowSelection, onRowSelectionChange: setRowSelection, canSelect: canSelectMember }
      : undefined,
  });

  const renderList = () => {
    // 다음 페이지 조회가 실패해도 이미 불러온 목록은 유지한다.
    if (isError && !data) {
      return (
        <EmptyState
          header="구성원 목록을 불러오지 못했습니다"
          body="잠시 후 다시 시도해 주세요."
          primaryAction={{ children: "다시 시도", onClick: () => void refetch() }}
        />
      );
    }

    if (isPending) {
      return <EmptyState header="구성원 목록을 불러오는 중입니다" body="잠시만 기다려 주세요." />;
    }

    if (members.length === 0) {
      return isFiltered ? (
        <EmptyState body="조건에 맞는 구성원이 없습니다." />
      ) : (
        <EmptyState header="등록된 구성원이 없습니다" body="구성원을 추가하면 확인할 수 있어요." />
      );
    }

    return (
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
            onClick={() => void handleLoadMore()}
          >
            목록 더보기
          </BlockButton>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-16 px-margin-lg pb-margin-xl desktop:px-margin-xl">
      <div className="flex items-center gap-28 py-12">
        <h2 className="flex-1 text-title-2 font-title-subtle text-object-boldest">구성원 목록</h2>
        {isDesktop && (
          <div className="flex items-center gap-16">
            {/* 변경 이력 화면이 없어 비활성화한다. */}
            <BlockButton
              hierarchy="secondary"
              variant="outlined"
              size="sm"
              prefixIcon="clock-3"
              disabled
            >
              변경 이력
            </BlockButton>
            <BlockButton
              hierarchy="accent"
              variant="outlined"
              size="sm"
              prefixIcon="table-of-contents"
            >
              기수별 활동 정보 설정
            </BlockButton>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-12">
        <div className="rounded-10 border border-stroke-subtle bg-surface-standard">
          <div className="flex items-center gap-16 px-16 py-12">
            <Tabs.Root variant="content" value="all">
              <Tabs.List>
                <Tabs.Trigger value="all" badge={totalCount}>
                  전체
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            {isDesktop && (
              <div className="flex items-center gap-12">
                <BlockButton hierarchy="primary" variant="solid" size="sm" prefixIcon="plus">
                  구성원 추가
                </BlockButton>
                {selectedCount > 0 && (
                  <span className="text-label-md text-accent-neutral">
                    {selectedCount}개 선택됨
                  </span>
                )}
              </div>
            )}
            {isDesktop && selectedCount > 0 && (
              <BlockButton feedback="destructive" size="sm" prefixIcon="trash" className="ml-auto">
                삭제
              </BlockButton>
            )}
          </div>
          <div className="border-t border-stroke-subtle px-16 py-12">
            <Filter
              fields={createFilterFields(semesters)}
              values={filterValues}
              onValuesChange={handleFilterChange}
            />
          </div>
        </div>
        {renderList()}
      </div>
    </div>
  );
}
