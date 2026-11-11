import { useMemo } from "react";
import { createPortal } from "react-dom";

import { BlockButton } from "@jects/jds";
import { useInfiniteQuery } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueryKeys } from "@/apis/apply/queryKeys";
import type { SubmittedApply } from "@/apis/apply/schemas";
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/common/data-table";
import { useHeaderActionSlot } from "@/components/layout/Header.context";

// TODO: recruitId는 URL 파라미터로, 필터 값은 필터 상태로 교체한다.
const CONDITION = { recruitId: 1, size: 20 } as const;

const columnHelper = createDataTableColumnHelper<SubmittedApply>();
const COLUMNS = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "이름",
    meta: { cellType: "title", getDescription: (apply) => apply.phoneNumber },
  }),
  columnHelper.accessor("careerDetails", { header: "경력" }),
  columnHelper.accessor("selectionResult", { header: "선발 결과" }),
  columnHelper.accessor("waitlistNumber", { header: "예비 번호" }),
  columnHelper.accessor("note", { header: "비고" }),
]);

export default function SubmittedRecruitAppliesPage() {
  const headerActionSlot = useHeaderActionSlot();
  const { data } = useInfiniteQuery({
    queryKey: applyQueryKeys.submittedApplies(CONDITION),
    queryFn: ({ pageParam }) => applyApi.getSubmittedApplies({ ...CONDITION, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });

  const applies = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data]);

  const table = useDataTable({
    data: applies,
    columns: COLUMNS,
    getRowId: (apply) => String(apply.applyId),
  });

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
      <div className="px-margin-lg desktop:px-margin-xl">
        <DataTable table={table} />
      </div>
    </section>
  );
}
