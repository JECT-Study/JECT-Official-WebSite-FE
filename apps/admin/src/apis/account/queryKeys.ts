import type { AccountListParams } from "./query";

export const accountQueryKeys = {
  all: ["account"] as const,
  lists: () => [...accountQueryKeys.all, "list"] as const,
  list: (params: AccountListParams) => [...accountQueryKeys.lists(), params] as const,
};
