export const applyQueryKeys = {
  all: ["apply"] as const,
  questions: (recruitId: number) => [...applyQueryKeys.all, "questions", recruitId] as const,
  tempApplication: (recruitId: number) =>
    [...applyQueryKeys.all, "tempApplication", recruitId] as const,
};

export const applyMutationKeys = {
  uploadPortfolio: [...applyQueryKeys.all, "uploadPortfolio"] as const,
};
