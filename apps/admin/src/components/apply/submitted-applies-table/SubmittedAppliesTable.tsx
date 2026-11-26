import { ContentBadge, Icon } from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";

import type { SelectionResult, SubmittedApply } from "@/apis/apply/schemas";
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/common/data-table";
import { CAREER_DETAILS_LABELS, SELECTION_RESULT_LABELS } from "@/constants/apply";
import { formatPhoneNumber } from "@/utils/phoneNumber";

const SELECTION_RESULT_BADGE_STYLES = {
  UNDECIDED: { badgeStyle: "alpha", hierarchy: "tertiary" },
  PASSED: { badgeStyle: "outlined", hierarchy: "accent" },
  WAITLISTED: { badgeStyle: "outlined", hierarchy: "secondary" },
  FAILED: { badgeStyle: "outlined", feedback: "destructive" },
} as const satisfies Record<SelectionResult, object>;

interface SelectionResultBadgeProps {
  selectionResult: SelectionResult;
}

function SelectionResultBadge({ selectionResult }: SelectionResultBadgeProps) {
  return (
    <ContentBadge size="sm" {...SELECTION_RESULT_BADGE_STYLES[selectionResult]}>
      {SELECTION_RESULT_LABELS[selectionResult]}
    </ContentBadge>
  );
}

function EmptyValue() {
  return <span className="text-object-subtle">-</span>;
}

const columnHelper = createDataTableColumnHelper<SubmittedApply>();

const nameColumn = columnHelper.accessor("name", {
  header: "이름",
  meta: { cellType: "title", getDescription: (apply) => formatPhoneNumber(apply.phoneNumber) },
});

const selectionResultColumn = columnHelper.accessor("selectionResult", {
  header: "합격 여부",
  cell: ({ getValue }) => <SelectionResultBadge selectionResult={getValue()} />,
});

const mobileColumns = columnHelper.columns([nameColumn, selectionResultColumn]);

const columns = columnHelper.columns([
  nameColumn,
  columnHelper.accessor("careerDetails", {
    header: "지원자 신분",
    cell: ({ getValue }) => CAREER_DETAILS_LABELS[getValue()],
  }),
  selectionResultColumn,
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

const getApplyRowId = (apply: SubmittedApply) => String(apply.applyId);

interface SubmittedAppliesTableProps {
  applies: SubmittedApply[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
}

export default function SubmittedAppliesTable({
  applies,
  rowSelection,
  onRowSelectionChange,
}: SubmittedAppliesTableProps) {
  const { isMobile, isDesktop } = useMediaQueryFlags();

  const table = useDataTable({
    data: applies,
    columns: isMobile ? mobileColumns : columns,
    getRowId: getApplyRowId,
    // 좁은 화면에서는 선택을 유지한 채 체크박스 열만 숨긴다.
    selection: isDesktop ? { rowSelection, onRowSelectionChange } : undefined,
  });

  return <DataTable table={table} />;
}
