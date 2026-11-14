import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { BlockButton, EmptyState, Icon, useToast } from "@jects/jds";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { applyApi } from "@/apis/apply/api";
import { applyQueryKeys } from "@/apis/apply/queryKeys";
import type { CareerDetails, SelectionResult, SubmittedApply } from "@/apis/apply/schemas";
import SelectionResultBadge from "@/components/apply/selection-result-badge/SelectionResultBadge";
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/common/data-table";
import Filter from "@/components/common/filter/Filter";
import type { FilterField, FilterValues } from "@/components/common/filter/Filter.types";
import { useHeaderActionSlot } from "@/components/layout/Header.context";
import { CAREER_DETAILS_LABELS } from "@/constants/careerDetails";
import { SELECTION_RESULT_LABELS } from "@/constants/selectionResult";
import { formatPhoneNumber } from "@/utils/phoneNumber";

const PAGE_SIZE = 30;

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const FILTER_FIELDS: FilterField[] = [
  { id: "careerDetails", label: "지원자 신분", options: toOptions(CAREER_DETAILS_LABELS) },
  { id: "selectionResults", label: "합격 여부", options: toOptions(SELECTION_RESULT_LABELS) },
];

// 옵션 값이 FILTER_FIELDS에서 오므로 각 필드의 타입으로 좁힌다.
interface SubmittedAppliesFilterValues {
  careerDetails?: CareerDetails[];
  selectionResults?: SelectionResult[];
}

// 칩만 추가하고 고르지 않은 필터는 조건에서 빼야 같은 쿼리 키로 유지된다.
function toFilterCondition(filterValues: FilterValues) {
  const { careerDetails, selectionResults } = filterValues as SubmittedAppliesFilterValues;

  return {
    careerDetails: careerDetails?.length ? careerDetails : undefined,
    selectionResults: selectionResults?.length ? selectionResults : undefined,
  };
}

function EmptyValue() {
  return <span className="text-object-subtle">-</span>;
}

const columnHelper = createDataTableColumnHelper<SubmittedApply>();
const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "이름",
    meta: { cellType: "title", getDescription: (apply) => formatPhoneNumber(apply.phoneNumber) },
  }),
  columnHelper.accessor("careerDetails", {
    header: "지원자 신분",
    cell: ({ getValue }) => CAREER_DETAILS_LABELS[getValue()],
  }),
  columnHelper.accessor("selectionResult", {
    header: "합격 여부",
    cell: ({ getValue }) => <SelectionResultBadge selectionResult={getValue()} />,
  }),
  columnHelper.accessor("waitlistNumber", {
    header: "예비 번호",
    cell: ({ getValue }) => getValue() ?? <EmptyValue />,
  }),
  columnHelper.accessor("note", {
    header: "비고",
    cell: ({ getValue }) =>
      getValue() ? (
        <Icon name="sticky-note" size="lg" className="text-object-alternative" />
      ) : (
        <EmptyValue />
      ),
  }),
]);

export default function SubmittedRecruitAppliesPage() {
  const headerActionSlot = useHeaderActionSlot();
  const recruitId = Number(useParams().recruitId);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const { toast } = useToast();

  const condition = { recruitId, size: PAGE_SIZE, ...toFilterCondition(filterValues) };

  const {
    data,
    hasNextPage,
    isPending,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: applyQueryKeys.submittedApplies(condition),
    queryFn: ({ pageParam }) => applyApi.getSubmittedApplies({ ...condition, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });

  const applies = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data]);

  const table = useDataTable({
    data: applies,
    columns,
    getRowId: (apply) => String(apply.applyId),
  });

  const handleLoadMore = async () => {
    const result = await fetchNextPage({ cancelRefetch: false });
    if (result.isFetchNextPageError) {
      toast.destructive("지원서 목록을 불러오지 못했습니다", {
        description: "잠시 후 다시 시도해 주세요.",
      });
    }
  };

  return (
    <section className="flex flex-col">
      {headerActionSlot &&
        createPortal(
          <BlockButton feedback="positive" prefixIcon="save" className="max-desktop:hidden">
            검토 확정
          </BlockButton>,
          headerActionSlot
        )}
      <div className="flex items-center gap-28 px-margin-lg py-12 desktop:px-margin-xl">
        {/* TODO: 공고 정보를 받을 API가 정해지면 제목을 연결한다. */}
        <h2 className="min-w-0 flex-1 text-title-2 font-title-subtle break-keep text-object-boldest">
          젝트 메이커스 팀 프론트엔드 개발자(FE) 모집
        </h2>
        <div className="flex shrink-0 items-center gap-16 max-desktop:hidden">
          <BlockButton hierarchy="primary" variant="outlined" size="sm" prefixIcon="clock-3">
            변경 이력
          </BlockButton>
          <BlockButton
            hierarchy="accent"
            variant="outlined"
            size="sm"
            prefixIcon="table-of-contents"
          >
            예비번호 조정
          </BlockButton>
        </div>
      </div>
      <div className="flex flex-col gap-12 px-margin-lg py-16 desktop:px-margin-xl">
        <div className="rounded-10 border border-stroke-subtle">
          <div className="flex border-b border-stroke-subtle px-16 py-12">
            {/* TODO: 필터와 무관한 공고의 전체 지원서 수를 받을 API가 정해지면 연결한다. */}
            <p className="flex gap-2 rounded-6 border border-stroke-alpha-subtle px-12 py-6 text-label-md text-object-alternative">
              <span className="font-label-bold">전체</span>
              <span className="font-label-subtle">127</span>
            </p>
          </div>
          <div className="min-h-48 px-16 py-10">
            <Filter fields={FILTER_FIELDS} values={filterValues} onValuesChange={setFilterValues} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-10">
          {isPending ? (
            <EmptyState header="지원서 목록을 불러오는 중입니다" body="잠시만 기다려 주세요." />
          ) : isError && !isFetchNextPageError ? (
            <EmptyState
              header="지원서 목록을 불러오지 못했습니다"
              body="잠시 후 다시 시도해 주세요."
            />
          ) : data?.pages[0].content.length === 0 ? (
            <EmptyState
              header="제출 완료된 지원서가 없습니다"
              body="지원서가 제출되면 확인할 수 있어요."
            />
          ) : (
            <>
              <DataTable table={table} />
              {hasNextPage && (
                <BlockButton
                  hierarchy="primary"
                  variant="hollow"
                  size="md"
                  suffixIcon={isFetchingNextPage ? "loader-circle" : "chevron-down"}
                  className={isFetchingNextPage ? "[&_svg]:animate-spin" : undefined}
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
    </section>
  );
}
