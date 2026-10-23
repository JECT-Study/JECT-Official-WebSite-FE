export const API_ENDPOINTS = {
  activeRecruits: "/recruits/active",
  recruit: (recruitId: number) => `/recruits/${recruitId}`,
} as const;
