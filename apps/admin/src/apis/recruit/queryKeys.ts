import type { ApplyManagementRecruitsQuery } from "./api";

export const recruitQueryKeys = {
  all: ["recruit"] as const,
  applyManagementRecruits: (query: Omit<ApplyManagementRecruitsQuery, "cursor">) =>
    [...recruitQueryKeys.all, "applyManagement", query] as const,
};
