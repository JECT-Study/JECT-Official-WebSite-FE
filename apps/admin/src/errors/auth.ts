import type { ErrorCode } from "@ject/api-types/errors";

import { ROUTES } from "@/constants/routes";

export const REFRESH_REQUIRED_ERROR_CODES: ReadonlySet<string> = new Set<ErrorCode>([
  "AUTH-6",
  "AUTH-7",
  "GLOBAL-5",
  "GLOBAL-6",
]);

export const RELOGIN_REQUIRED_ERROR_CODES: ReadonlySet<string> = new Set<ErrorCode>([
  "AUTH-3",
  "AUTH-4",
  "GLOBAL-8",
]);

// 전체 새로고침으로 이전 세션의 쿼리 캐시도 함께 비운다.
export function redirectToLogin() {
  if (window.location.pathname !== ROUTES.login) window.location.replace(ROUTES.login);
}
