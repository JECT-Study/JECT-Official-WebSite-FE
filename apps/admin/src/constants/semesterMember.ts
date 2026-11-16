import type { components } from "@ject/api-types/admin";

import type { JobFamily } from "@/apis/recruit/schemas";

type Schemas = components["schemas"];

export type RecruitTypeDetail = Schemas["RecruitTypeDetail"];
export type CareerDetails = Schemas["CareerDetails"];
export type ExperiencePeriod = Schemas["ExperiencePeriod"];
export type ActivityStatus = Schemas["ActivityStatus"];

export const SEMESTER_MEMBER_PAGE_SIZE = 30;

export const SEMESTER_MEMBER_JOB_FAMILIES = [
  "FE",
  "BE",
  "PD",
  "PM",
] as const satisfies readonly JobFamily[];

export const RECRUIT_TYPE_DETAILS = [
  "REGULAR",
  "NEW",
  "REFILL",
] as const satisfies readonly RecruitTypeDetail[];

// 서버가 일반 구성원에게 허용하는 활동 상태만 둔다.
export const SEMESTER_MEMBER_ACTIVITY_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "WITHDRAWN",
] as const satisfies readonly ActivityStatus[];

export const RECRUIT_TYPE_DETAIL_LABELS: Record<RecruitTypeDetail, string> = {
  REGULAR: "정규 모집",
  NEW: "신규 모집",
  REFILL: "충원 모집",
};

export const CAREER_DETAILS_LABELS: Record<CareerDetails, string> = {
  STUDENT: "대학생(재학/휴학)",
  EXPECTED_GRADUATE: "대학 졸업 예정",
  JOB_SEEKER: "취준생",
  BETWEEN_JOBS: "이직 준비 중",
  EMPLOYEE: "재직자",
};

export const EXPERIENCE_PERIOD_LABELS: Record<ExperiencePeriod, string> = {
  NONE: "경험 없음",
  ONE_TO_TWO: "1~2년",
  THREE_TO_FOUR: "3~4년",
  FIVE_PLUS: "5년 이상",
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  ACTIVE: "활동 중",
  COMPLETED: "완주",
  WITHDRAWN: "탈퇴",
  ENDED: "활동 종료",
  DROPOUT: "중도 이탈",
};
