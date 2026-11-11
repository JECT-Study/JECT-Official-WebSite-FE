import { ContentBadge } from "@jects/jds";

import type { SelectionResult } from "@/apis/apply/schemas";

const BADGES = {
  UNDECIDED: { label: "검토 중", badgeStyle: "alpha", hierarchy: "tertiary" },
  PASSED: { label: "합격", badgeStyle: "outlined", hierarchy: "accent" },
  WAITLISTED: { label: "예비 합격", badgeStyle: "outlined", hierarchy: "secondary" },
  FAILED: { label: "불합격", badgeStyle: "outlined", feedback: "destructive" },
} as const satisfies Record<SelectionResult, object>;

interface SelectionResultBadgeProps {
  selectionResult: SelectionResult;
}

export default function SelectionResultBadge({ selectionResult }: SelectionResultBadgeProps) {
  const { label, ...badgeProps } = BADGES[selectionResult];

  return (
    <ContentBadge size="sm" {...badgeProps}>
      {label}
    </ContentBadge>
  );
}
