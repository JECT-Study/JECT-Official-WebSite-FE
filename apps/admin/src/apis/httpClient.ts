import { createApiClient } from "@ject/api-client";
import { createRefreshMiddleware } from "@ject/api-client/auth";
import type { paths } from "@ject/api-types/admin";
import type { paths as CorePaths } from "@ject/api-types/core";

import { ROUTES, routeTo } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

function handleRefreshFailure() {
  useAuthStore.getState().setIsLoggedIn(false);

  const { pathname, search } = window.location;
  // 전체 새로고침으로 이전 세션의 쿼리 캐시도 함께 비운다.
  if (pathname !== ROUTES.login) window.location.replace(routeTo.login(pathname + search));
}

// 기수 목록처럼 관리자 스펙에 없는 공개 API는 필요한 경로만 골라 함께 사용한다.
interface HttpClientPaths extends paths, Pick<CorePaths, "/semesters"> {}

export const httpClient = createApiClient<HttpClientPaths>({ baseUrl: "", credentials: "include" });

httpClient.use(createRefreshMiddleware({ onRefreshFailure: handleRefreshFailure }));
