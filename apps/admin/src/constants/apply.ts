import type { CareerDetails, SelectionResult } from "@/apis/apply/schemas";

export const CAREER_DETAILS_LABELS: Record<CareerDetails, string> = {
  STUDENT: "대학생(재학/휴학)",
  EXPECTED_GRADUATE: "대학 졸업 예정",
  JOB_SEEKER: "취준생",
  BETWEEN_JOBS: "이직 준비 중",
  EMPLOYEE: "재직자",
};

export const SELECTION_RESULT_LABELS: Record<SelectionResult, string> = {
  UNDECIDED: "검토 중",
  PASSED: "합격",
  WAITLISTED: "예비 합격",
  FAILED: "불합격",
};
