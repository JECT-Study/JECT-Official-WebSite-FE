import { infiniteQueryOptions } from "@tanstack/react-query";

import { MAKERS_MEMBER_PAGE_SIZE } from "@/constants/makersMember";

import { makersMemberApi } from "./api";

export const makersMemberQueries = {
  all: () => ["makersMember"] as const,
  lists: () => [...makersMemberQueries.all(), "list"] as const,
  list: () =>
    infiniteQueryOptions({
      queryKey: makersMemberQueries.lists(),
      queryFn: ({ pageParam }) =>
        makersMemberApi.getMakersMembers({ cursor: pageParam, size: MAKERS_MEMBER_PAGE_SIZE }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    }),
};
