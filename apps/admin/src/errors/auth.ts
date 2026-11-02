import type { ErrorCode } from "@ject/api-types/errors";

import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

const REFRESH_REQUIRED_ERROR_CODES: ReadonlySet<string> = new Set<ErrorCode>(["GLOBAL-6"]);

const RELOGIN_REQUIRED_ERROR_CODES: ReadonlySet<string> = new Set<ErrorCode>(["AUTH-3", "AUTH-4"]);

export const isRefreshRequired = (status: string) => REFRESH_REQUIRED_ERROR_CODES.has(status);

const isReloginRequired = (status: string) => RELOGIN_REQUIRED_ERROR_CODES.has(status);

// 전체 새로고침으로 이전 세션의 쿼리 캐시도 함께 비운다.
export function handleAuthFailure(status: string) {
  if (!isRefreshRequired(status) && !isReloginRequired(status)) return;

  useAuthStore.getState().setIsLoggedIn(false);

  if (window.location.pathname !== ROUTES.login) window.location.replace(ROUTES.login);
}
