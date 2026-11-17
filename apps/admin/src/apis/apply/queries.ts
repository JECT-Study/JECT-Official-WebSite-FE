import { infiniteQueryOptions } from "@tanstack/react-query";

import { applyApi, type SubmittedAppliesCondition } from "./api";

export const applyQueries = {
  all: () => ["apply"] as const,
  submittedAppliesLists: () => [...applyQueries.all(), "submitted"] as const,
  submittedApplies: (condition: Omit<SubmittedAppliesCondition, "cursor">) =>
    infiniteQueryOptions({
      queryKey: [...applyQueries.submittedAppliesLists(), condition],
      queryFn: ({ pageParam }) => applyApi.getSubmittedApplies({ ...condition, cursor: pageParam }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    }),
};
