import { queryOptions } from "@tanstack/react-query";

import { semesterApi } from "./api";

export const semesterQueries = {
  all: () => ["semester"] as const,
  list: () =>
    queryOptions({
      queryKey: [...semesterQueries.all(), "list"],
      queryFn: semesterApi.getSemesters,
    }),
};
