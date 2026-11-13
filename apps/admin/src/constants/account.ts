export const ACCOUNT_ROLES = ["ADMIN", "OPERATIONS", "SUPPORTER"] as const;
export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export const ACCOUNT_STATUSES = ["ACTIVE", "LOCKED"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const ACCOUNT_ROLE_LABELS: Record<AccountRole, string> = {
  ADMIN: "어드민",
  OPERATIONS: "운영팀",
  SUPPORTER: "서포터즈",
};

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE: "활성화",
  LOCKED: "비활성화",
};

export const ACCOUNT_PAGE_SIZE = 20;
