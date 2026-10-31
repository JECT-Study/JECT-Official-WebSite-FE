import type { components } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";
import { API_ENDPOINTS } from "@/constants/endpoints";

type LoginRequest = components["schemas"]["AdminLoginRequest"];

// 토큰은 응답 쿠키로 내려오므로 응답 본문은 사용하지 않는다.
export const authApi = {
  login: (body: LoginRequest) => httpClient.post<void>(API_ENDPOINTS.login, body),

  logout: () => httpClient.post<void>(API_ENDPOINTS.logout),

  refresh: () => httpClient.post<void>(API_ENDPOINTS.refresh),
} as const;
