import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BlockButton, type BlockButtonProps, EmptyState, Tabs } from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import { hashKey, keepPreviousData, useInfiniteQuery, useIsMutating } from "@tanstack/react-query";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { useParams, useSearchParams } from "react-router-dom";

import type { SubmittedAppliesCondition } from "@/apis/apply/api";
import { applyMutationKeys, applyQueries } from "@/apis/apply/queries";
import type { SelectionResult, SubmittedApply } from "@/apis/apply/schemas";
import SubmittedAppliesTable from "@/components/apply/submitted-applies-table/SubmittedAppliesTable";
import SubmittedApplyDrawer from "@/components/apply/submitted-apply-drawer/SubmittedApplyDrawer";
import { deselectRows } from "@/components/common/data-table";
import Filter from "@/components/common/filter/Filter";
import { normalizeFilterValues } from "@/components/common/filter/normalizeFilterValues";
import type {
  FilterField,
  FilterOptionValue,
  FilterValues,
} from "@/components/common/filter/types";
import { useHeaderActionSlot } from "@/components/layout/HeaderActionSlotContext";
import { CAREER_DETAILS_LABELS, SELECTION_RESULT_LABELS } from "@/constants/apply";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { TOAST_CONTENT } from "@/constants/toast";
import { useDeleteSubmittedAppliesMutation } from "@/hooks/apply/useDeleteSubmittedAppliesMutation";
import { useUpdateSelectionResultsMutation } from "@/hooks/apply/useUpdateSelectionResultsMutation";
import NotFoundPage from "@/pages/NotFoundPage";
import { showDialog } from "@/stores/dialogStore";
import { parseIdParam } from "@/utils/parseIdParam";
import { showToast } from "@/utils/showToast";

const PAGE_SIZE = 30;

interface SelectionResultButton {
  selectionResult: SelectionResult;
  hierarchy: BlockButtonProps["hierarchy"];
  variant: BlockButtonProps["variant"];
}

const SELECTION_RESULT_BUTTONS: SelectionResultButton[] = [
  { selectionResult: "PASSED", hierarchy: "accent", variant: "outlined" },
  { selectionResult: "WAITLISTED", hierarchy: "primary", variant: "solid" },
  { selectionResult: "FAILED", hierarchy: "secondary", variant: "outlined" },
];

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const FILTER_FIELDS: FilterField[] = [
  { id: "careerDetails", label: "지원자 신분", options: toOptions(CAREER_DETAILS_LABELS) },
  { id: "selectionResults", label: "합격 여부", options: toOptions(SELECTION_RESULT_LABELS) },
];

// 옵션 값이 FILTER_FIELDS에서 오므로 각 필드의 타입으로 좁힌다.
type SubmittedAppliesFilterValues = Pick<
  SubmittedAppliesCondition,
  "careerDetails" | "selectionResults"
>;

const toParam = (value: FilterOptionValue) => String(value).toLowerCase();

// 칩만 추가하고 고르지 않은 필터는 빈 값(`?careerDetails=`)으로 남겨 칩을 유지한다.
function parseFilterValues(searchParams: URLSearchParams): FilterValues {
  const values = Object.fromEntries(
    [...new Set(searchParams.keys())].map((fieldId) => [
      fieldId,
      searchParams.getAll(fieldId).map((param) => param.toUpperCase()),
    ])
  );

  return normalizeFilterValues(FILTER_FIELDS, values);
}

function toSearchParams(searchParams: URLSearchParams, filterValues: FilterValues) {
  const nextParams = new URLSearchParams(searchParams);
  FILTER_FIELDS.forEach(({ id }) => nextParams.delete(id));

  Object.entries(filterValues).forEach(([fieldId, selected]) => {
    if (selected.length === 0) {
      nextParams.append(fieldId, "");
      return;
    }
    selected.forEach((value) => nextParams.append(fieldId, toParam(value)));
  });

  return nextParams;
}

// 칩만 추가하고 고르지 않은 필터는 조건에서 빼야 같은 쿼리 키로 유지된다.
function toFilterCondition(filterValues: FilterValues) {
  const { careerDetails, selectionResults } = filterValues as SubmittedAppliesFilterValues;

  return {
    careerDetails: careerDetails?.length ? careerDetails : undefined,
    selectionResults: selectionResults?.length ? selectionResults : undefined,
  };
}

interface ApplyListProps {
  applies: SubmittedApply[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isFiltered: boolean;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onRowClick: (apply: SubmittedApply) => void;
}

function ApplyList({
  applies,
  isLoading,
  isError,
  isEmpty,
  isFiltered,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  onLoadMore,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
}: ApplyListProps) {
  if (isLoading) {
    return <EmptyState header="지원서 목록을 불러오는 중입니다" body="잠시만 기다려주세요." />;
  }

  if (isError) {
    return (
      <EmptyState header="지원서 목록을 불러오지 못했습니다" body="잠시 후 다시 시도해주세요." />
    );
  }

  if (isEmpty && isFiltered) {
    return (
      <EmptyState
        header="선택한 조건에 맞는 지원서가 없습니다"
        body="필터 조건을 바꾸거나 해제해 보세요."
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        header="제출 완료된 지원서가 없습니다"
        body="지원서가 제출되면 확인할 수 있어요."
      />
    );
  }

  return (
    <>
      <SubmittedAppliesTable
        applies={applies}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        onRowClick={onRowClick}
      />
      {hasNextPage && (
        <BlockButton
          hierarchy="primary"
          variant="hollow"
          size="md"
          suffixIcon={isFetchingNextPage ? "loader-circle" : "chevron-down"}
          className={isFetchingNextPage ? "[&_svg]:animate-spin" : undefined}
          disabled={isFetching}
          onClick={onLoadMore}
        >
          목록 더보기
        </BlockButton>
      )}
    </>
  );
}

interface SubmittedRecruitAppliesProps {
  recruitId: number;
}

function SubmittedRecruitApplies({ recruitId }: SubmittedRecruitAppliesProps) {
  const headerActionSlot = useHeaderActionSlot();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDesktop } = useMediaQueryFlags();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filterValues = parseFilterValues(searchParams);
  const filterCondition = toFilterCondition(filterValues);
  const isFiltered = Object.values(filterCondition).some(Boolean);
  const condition = { recruitId, size: PAGE_SIZE, ...filterCondition };

  const {
    data,
    hasNextPage,
    isPending,
    isPlaceholderData,
    isError,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    ...applyQueries.submittedApplies(condition),
    // 필터를 바꾸는 동안 전체 개수를 유지하려고 이전 결과를 남긴다. 목록은 로딩 화면을 표시한다.
    placeholderData: keepPreviousData,
  });

  const applies = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data]);
  const totalCount = data?.pages.at(-1)?.totalCount;

  // 결과에서 빠진 행이 선택된 채 작업 대상이 되지 않도록 조회 조건이 바뀌면 선택을 비운다.
  const handleFilterChange = (nextValues: FilterValues) => {
    const isConditionChanged =
      hashKey([toFilterCondition(nextValues)]) !== hashKey([toFilterCondition(filterValues)]);
    if (isConditionChanged) setRowSelection({});

    setSearchParams(toSearchParams(searchParams, nextValues), { replace: true });
  };

  const selectedApplies = applies.filter((apply) => rowSelection[apply.applyId]);
  const selectedApplyIds = selectedApplies.map((apply) => apply.applyId);
  const hasSelectedApplies = selectedApplyIds.length > 0;
  // 결과가 이미 지정된 지원서는 상세에서만 바꿀 수 있어 목록 일괄 변경은 검토 중끼리만 허용한다.
  const canUpdateSelectionResults = selectedApplies.every(
    (apply) => apply.selectionResult === "UNDECIDED"
  );

  const { mutateAsync: updateSelectionResults } = useUpdateSelectionResultsMutation();
  const { mutateAsync: deleteSubmittedApplies } = useDeleteSubmittedAppliesMutation();
  const isActionPending = useIsMutating({ mutationKey: applyMutationKeys.selectionActions() }) > 0;
  const listRef = useRef<HTMLDivElement>(null);

  // 요청 중에 새로 선택한 행은 남기도록 요청한 행만 선택에서 뺀다.
  const deselectApplies = (applyIds: number[]) =>
    setRowSelection((prev) => deselectRows(prev, applyIds));

  const openUpdateSelectionResultsDialog = (selectionResult: SelectionResult) => {
    const applyIds = selectedApplyIds;
    const content = DIALOG_CONTENT.updateSelectionResults(
      applyIds.length,
      SELECTION_RESULT_LABELS[selectionResult]
    );
    void showDialog(content, {
      onPrimaryClick: () =>
        updateSelectionResults(
          { recruitId, applyIds, selectionResult },
          { onSuccess: () => deselectApplies(applyIds) }
        ),
      fallbackFocusRef: listRef,
    });
  };

  const openDeleteDialog = () => {
    const applyIds = selectedApplyIds;
    void showDialog(DIALOG_CONTENT.deleteSubmittedApplies(applyIds.length), {
      onPrimaryClick: () =>
        deleteSubmittedApplies({ applyIds }, { onSuccess: () => deselectApplies(applyIds) }),
      fallbackFocusRef: listRef,
    });
  };

  const [openedApplyId, setOpenedApplyId] = useState<number | null>(null);

  const handleLoadMore = async () => {
    const result = await fetchNextPage({ cancelRefetch: false });
    if (result.isFetchNextPageError) {
      showToast(TOAST_CONTENT.loadSubmittedAppliesFailed);
    }
  };

  // TODO: 공고 정보를 받을 API가 정해지면 제목을 연결한다.
  const recruitTitle = "젝트 메이커스 팀 프론트엔드 개발자(FE) 모집";

  return (
    <section className="flex flex-col">
      <title>{recruitTitle}</title>
      {headerActionSlot &&
        createPortal(
          <BlockButton feedback="positive" prefixIcon="save" className="max-desktop:hidden">
            검토 확정
          </BlockButton>,
          headerActionSlot
        )}
      <div className="flex items-center gap-28 px-margin-lg py-12 desktop:px-margin-xl">
        <h2 className="min-w-0 flex-1 text-title-2 font-title-subtle break-keep text-object-boldest">
          {recruitTitle}
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
          <div className="flex items-center gap-16 border-b border-stroke-subtle px-16 py-12">
            <Tabs.Root variant="content" value="all">
              <Tabs.List>
                <Tabs.Trigger value="all" badge={totalCount}>
                  전체
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            {/* 좁은 화면에서는 선택을 유지한 채 체크박스만 숨기므로 선택 작업 버튼도 데스크톱에서만 보인다. */}
            {isDesktop && hasSelectedApplies && (
              <>
                <div className="flex items-center gap-12">
                  <p className="text-label-md font-label-normal text-accent-neutral">
                    {selectedApplyIds.length}개 선택됨
                  </p>
                  <div className="flex items-center gap-10">
                    {SELECTION_RESULT_BUTTONS.map(({ selectionResult, hierarchy, variant }) => (
                      <BlockButton
                        key={selectionResult}
                        hierarchy={hierarchy}
                        variant={variant}
                        size="sm"
                        disabled={isActionPending || !canUpdateSelectionResults}
                        onClick={() => openUpdateSelectionResultsDialog(selectionResult)}
                      >
                        {SELECTION_RESULT_LABELS[selectionResult]}
                      </BlockButton>
                    ))}
                  </div>
                </div>
                <BlockButton
                  feedback="destructive"
                  size="sm"
                  prefixIcon="trash"
                  className="ml-auto"
                  disabled={isActionPending}
                  onClick={openDeleteDialog}
                >
                  삭제
                </BlockButton>
              </>
            )}
          </div>
          <div className="min-h-48 px-16 py-10">
            <Filter
              fields={FILTER_FIELDS}
              values={filterValues}
              onValuesChange={handleFilterChange}
            />
          </div>
        </div>
        <div ref={listRef} tabIndex={-1} className="flex flex-col items-center gap-10 outline-none">
          <ApplyList
            applies={applies}
            isLoading={isPending || isPlaceholderData}
            isError={isError && !data}
            isEmpty={data?.pages[0].content.length === 0}
            isFiltered={isFiltered}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            onRowClick={(apply) => setOpenedApplyId(apply.applyId)}
          />
        </div>
      </div>
      <SubmittedApplyDrawer applyId={openedApplyId} onClose={() => setOpenedApplyId(null)} />
    </section>
  );
}

export default function SubmittedRecruitAppliesPage() {
  const recruitId = parseIdParam(useParams().recruitId ?? "");

  if (recruitId === null) return <NotFoundPage />;

  return <SubmittedRecruitApplies key={recruitId} recruitId={recruitId} />;
}
