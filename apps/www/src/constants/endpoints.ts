export const API_ENDPOINTS = {
  activeRecruits: "/recruits/active",
  recruit: (recruitId: number) => `/recruits/${recruitId}`,
  memberExists: "/auth/login/exist",
  sendAuthCode: "/email/send/auth",
  verifyAuthCode: "/auth/code",
  registerApplicant: "/applicants/apply",
} as const;
