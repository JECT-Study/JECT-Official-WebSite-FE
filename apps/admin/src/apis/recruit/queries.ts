import { queryOptions } from "@tanstack/react-query";

import { type ApplyManagementRecruitsQuery, recruitApi } from "./api";

export const recruitQueries = {
  all: () => ["recruit"] as const,
  applyManagementRecruits: (query: Omit<ApplyManagementRecruitsQuery, "cursor">) =>
    queryOptions({
      queryKey: [...recruitQueries.all(), "applyManagementRecruits", query],
      queryFn: () => recruitApi.getApplyManagementRecruits(query),
    }),
};
