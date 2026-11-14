import { ContentBadge } from "@jects/jds";

import type { SelectionResult } from "@/apis/apply/schemas";
import { SELECTION_RESULT_LABELS } from "@/constants/selectionResult";

const BADGE_STYLES = {
  UNDECIDED: { badgeStyle: "alpha", hierarchy: "tertiary" },
  PASSED: { badgeStyle: "outlined", hierarchy: "accent" },
  WAITLISTED: { badgeStyle: "outlined", hierarchy: "secondary" },
  FAILED: { badgeStyle: "outlined", feedback: "destructive" },
} as const satisfies Record<SelectionResult, object>;

interface SelectionResultBadgeProps {
  selectionResult: SelectionResult;
}

export default function SelectionResultBadge({ selectionResult }: SelectionResultBadgeProps) {
  return (
    <ContentBadge size="sm" {...BADGE_STYLES[selectionResult]}>
      {SELECTION_RESULT_LABELS[selectionResult]}
    </ContentBadge>
  );
}
