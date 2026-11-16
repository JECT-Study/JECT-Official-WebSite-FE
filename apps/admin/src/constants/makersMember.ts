export const MAKERS_TEAMS = ["TEAM_1", "TEAM_2"] as const;
export type MakersTeam = (typeof MAKERS_TEAMS)[number];

export const RECRUIT_TYPE_DETAILS = ["REGULAR", "NEW", "REFILL"] as const;
export type RecruitTypeDetail = (typeof RECRUIT_TYPE_DETAILS)[number];

export const ACTIVITY_STATUSES = ["ACTIVE", "COMPLETED", "WITHDRAWN", "ENDED", "DROPOUT"] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export const MAKERS_TEAM_LABELS: Record<MakersTeam, string> = {
  TEAM_1: "1팀",
  TEAM_2: "2팀",
};

export const RECRUIT_TYPE_DETAIL_LABELS: Record<RecruitTypeDetail, string> = {
  REGULAR: "정규 모집",
  NEW: "신규 모집",
  REFILL: "충원 모집",
};

// 메이커스 팀에는 ACTIVE, ENDED, DROPOUT만 허용되지만 응답 파싱을 위해 서버 enum 전체를 매핑한다.
export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  ACTIVE: "활동 중",
  COMPLETED: "완주",
  WITHDRAWN: "탈퇴",
  ENDED: "활동 종료",
  DROPOUT: "중도 이탈",
};

export const MAKERS_MEMBER_PAGE_SIZE = 30;
