export const ACTIVITY_STATUSES = ["ACTIVE", "COMPLETED", "WITHDRAWN", "ENDED", "DROPOUT"] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export const RECRUIT_TYPE_DETAILS = ["REGULAR", "NEW", "REFILL"] as const;
export type RecruitTypeDetail = (typeof RECRUIT_TYPE_DETAILS)[number];

// 운영 서포터즈에는 ACTIVE, ENDED, DROPOUT만 허용되지만 라벨은 서버 enum 설명 전체를 그대로 둔다.
export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  ACTIVE: "활동 중",
  COMPLETED: "완주",
  WITHDRAWN: "탈퇴",
  ENDED: "활동 종료",
  DROPOUT: "중도 이탈",
};

export const RECRUIT_TYPE_DETAIL_LABELS: Record<RecruitTypeDetail, string> = {
  REGULAR: "정규 모집",
  NEW: "신규 모집",
  REFILL: "충원 모집",
};

export const SUPPORTERS_MEMBER_PAGE_SIZE = 30;
