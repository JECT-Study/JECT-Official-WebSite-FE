import { infiniteQueryOptions } from "@tanstack/react-query";

import { projectApi } from "./api";

export const projectQueries = {
  all: () => ["project"] as const,
  list: (category: string | null) =>
    infiniteQueryOptions({
      queryKey: [...projectQueries.all(), "list", category],
      queryFn: ({ pageParam }) => projectApi.getProjects(category, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    }),
};
