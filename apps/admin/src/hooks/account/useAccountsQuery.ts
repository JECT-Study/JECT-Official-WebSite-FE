import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { accountApi } from "@/apis/account/api";
import type { AccountListParams } from "@/apis/account/query";
import { accountQueryKeys } from "@/apis/account/queryKeys";

export function useAccountsQuery(params: AccountListParams) {
  return useQuery({
    queryKey: accountQueryKeys.list(params),
    queryFn: () => accountApi.getAccounts(params),
    placeholderData: keepPreviousData,
  });
}
