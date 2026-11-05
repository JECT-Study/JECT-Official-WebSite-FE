import type { components } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";
import { API_ENDPOINTS } from "@/constants/endpoints";

type LoginRequest = components["schemas"]["AdminLoginRequest"];

export const authApi = {
  login: (body: LoginRequest) => httpClient.post<void>(API_ENDPOINTS.login, body),

  logout: () => httpClient.post<void>(API_ENDPOINTS.logout),
} as const;
