import type { SubmittedAppliesCondition } from "./api";

export const applyQueryKeys = {
  all: ["apply"] as const,
  submittedApplies: (condition: Omit<SubmittedAppliesCondition, "cursor">) =>
    [...applyQueryKeys.all, "submitted", condition] as const,
};
