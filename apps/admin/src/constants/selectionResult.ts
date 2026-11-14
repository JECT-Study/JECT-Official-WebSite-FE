import type { SelectionResult } from "@/apis/apply/schemas";

export const SELECTION_RESULT_LABELS: Record<SelectionResult, string> = {
  UNDECIDED: "검토 중",
  PASSED: "합격",
  WAITLISTED: "예비 합격",
  FAILED: "불합격",
};
