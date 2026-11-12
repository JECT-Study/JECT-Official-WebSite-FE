export const applyQueryKeys = {
  all: ["apply"] as const,
  questions: (recruitId: number) => [...applyQueryKeys.all, "questions", recruitId] as const,
  tempApplications: () => [...applyQueryKeys.all, "tempApplication"] as const,
  tempApplication: (recruitId: number) =>
    [...applyQueryKeys.tempApplications(), recruitId] as const,
};

export const applyMutationKeys = {
  uploadPortfolio: [...applyQueryKeys.all, "uploadPortfolio"] as const,
};
