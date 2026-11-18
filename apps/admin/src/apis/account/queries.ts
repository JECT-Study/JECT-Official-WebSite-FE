import { queryOptions } from "@tanstack/react-query";

import { accountApi, type AccountListParams } from "./api";

export const accountQueries = {
  all: () => ["account"] as const,
  lists: () => [...accountQueries.all(), "list"] as const,
  list: (params: AccountListParams) =>
    queryOptions({
      queryKey: [...accountQueries.lists(), params],
      queryFn: () => accountApi.getAccounts(params),
    }),
};
