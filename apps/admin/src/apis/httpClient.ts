import { createApiClient } from "@ject/api-client";
import { createRefreshMiddleware } from "@ject/api-client/auth";
import type { paths } from "@ject/api-types/admin";

import { ROUTES, routeTo } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

function handleRefreshFailure() {
  useAuthStore.getState().setIsLoggedIn(false);

  const { pathname, search } = window.location;
  // 전체 새로고침으로 이전 세션의 쿼리 캐시도 함께 비운다.
  if (pathname !== ROUTES.login) window.location.replace(routeTo.login(pathname + search));
}

export const httpClient = createApiClient<paths>({ baseUrl: "", credentials: "include" });

httpClient.use(createRefreshMiddleware({ onRefreshFailure: handleRefreshFailure }));
