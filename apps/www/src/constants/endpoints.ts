export const API_ENDPOINTS = {
  activeRecruits: "/recruits/active",
  recruit: (recruitId: number) => `/recruits/${recruitId}`,
  memberExists: "/auth/login/exist",
  sendAuthCode: "/email/send/auth",
  verifyAuthCode: "/auth/code",
  registerApplicant: "/applicants/apply",
  applyProfile: "/apply/profile",
  applyQuestions: "/apply/questions",
  applyTemp: "/apply/temp",
  applySubmit: "/apply/submit",
  uploadPortfolios: "/upload/portfolios",
} as const;
