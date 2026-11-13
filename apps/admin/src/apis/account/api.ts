import { httpClient } from "@/apis/httpClient";
import { ACCOUNT_PAGE_SIZE, type AccountRole, type AccountStatus } from "@/constants/account";

import { accountPageSchema } from "./schemas";

export interface AccountListParams {
  roles: AccountRole[];
  statuses: AccountStatus[];
  /** 서버 기준으로 0부터 센다. */
  page: number;
}

// TODO: 서버의 Pageable에 @ParameterObject가 적용되면 직렬화 설정을 제거하고 page, size를 쿼리로 직접 전달한다.
const pageableQuerySerializer = { object: { style: "form", explode: true } } as const;

export const accountApi = {
  getAccounts: async ({ roles, statuses, page }: AccountListParams) => {
    const { data } = await httpClient.GET("/admin/accounts", {
      params: {
        query: {
          ...(roles.length > 0 && { roles }),
          ...(statuses.length > 0 && { statuses }),
          pageable: { page, size: ACCOUNT_PAGE_SIZE },
        },
      },
      querySerializer: pageableQuerySerializer,
    });

    return accountPageSchema.parse(data);
  },

  deactivateAccounts: async (memberIds: number[]) => {
    await httpClient.PATCH("/admin/accounts/members/active", {
      body: memberIds.map((memberId) => ({ memberId })),
    });
  },
} as const;
