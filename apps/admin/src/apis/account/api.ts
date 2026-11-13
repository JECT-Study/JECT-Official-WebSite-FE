import { httpClient } from "@/apis/httpClient";

import { type AccountListParams, accountListQuerySerializer, getAccountListQuery } from "./query";
import { accountPageSchema } from "./schemas";

export const accountApi = {
  getAccounts: async (params: AccountListParams) => {
    const { data } = await httpClient.GET("/admin/accounts", {
      params: { query: getAccountListQuery(params) },
      querySerializer: accountListQuerySerializer,
    });

    return accountPageSchema.parse(data);
  },

  deactivateAccounts: async (memberIds: number[]) => {
    await httpClient.PATCH("/admin/accounts/members/active", {
      body: memberIds.map((memberId) => ({ memberId })),
    });
  },
} as const;
