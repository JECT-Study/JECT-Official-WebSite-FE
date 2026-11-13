import { ACCOUNT_PAGE_SIZE, type AccountRole, type AccountStatus } from "@/constants/account";

export interface AccountListParams {
  roles: AccountRole[];
  statuses: AccountStatus[];
  /** 서버 기준으로 0부터 센다. */
  page: number;
}

// TODO: 서버의 Pageable에 @ParameterObject가 적용되면 직렬화 설정을 제거하고 page, size를 쿼리로 직접 전달한다.
export const accountListQuerySerializer = { object: { style: "form", explode: true } } as const;

export function getAccountListQuery({ roles, statuses, page }: AccountListParams) {
  return {
    ...(roles.length > 0 && { roles }),
    ...(statuses.length > 0 && { statuses }),
    pageable: { page, size: ACCOUNT_PAGE_SIZE },
  };
}
