import { infiniteQueryOptions } from "@tanstack/react-query";

import { supportersMemberApi } from "./api";

export const supportersMemberQueries = {
  all: () => ["supportersMember"] as const,
  lists: () => [...supportersMemberQueries.all(), "list"] as const,
  list: () =>
    infiniteQueryOptions({
      queryKey: supportersMemberQueries.lists(),
      queryFn: ({ pageParam }) => supportersMemberApi.getSupportersMembers(pageParam),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    }),
};
