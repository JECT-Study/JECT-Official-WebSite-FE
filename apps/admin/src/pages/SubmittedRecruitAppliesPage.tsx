import { useMemo } from "react";
import { createPortal } from "react-dom";

import { BlockButton, EmptyState, Icon, useToast } from "@jects/jds";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { applyApi } from "@/apis/apply/api";
import { applyQueryKeys } from "@/apis/apply/queryKeys";
import type { SubmittedApply } from "@/apis/apply/schemas";
import SelectionResultBadge from "@/components/apply/selection-result-badge/SelectionResultBadge";
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/common/data-table";
import { useHeaderActionSlot } from "@/components/layout/Header.context";
import { CAREER_DETAILS_LABELS } from "@/constants/careerDetails";
import { formatPhoneNumber } from "@/utils/phoneNumber";

const PAGE_SIZE = 30;

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
  const { toast } = useToast();

  const {
    data,
    hasNextPage,
    isPending,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: applyQueryKeys.submittedApplies({ recruitId, size: PAGE_SIZE }),
    queryFn: ({ pageParam }) =>
      applyApi.getSubmittedApplies({ recruitId, size: PAGE_SIZE, cursor: pageParam }),
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
      <div className="flex flex-col items-center gap-10 px-margin-lg py-16 desktop:px-margin-xl">
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
                suffixIcon="chevron-down"
                disabled={isFetchingNextPage}
                onClick={handleLoadMore}
              >
                목록 더보기
              </BlockButton>
            )}
          </>
        )}
      </div>
    </section>
  );
}
