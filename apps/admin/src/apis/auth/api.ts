import type { components } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";

type LoginRequest = components["schemas"]["AdminLoginRequest"];

export const authApi = {
  login: async (body: LoginRequest) => {
    await httpClient.POST("/admin-auth/login", { body });
  },

  logout: async () => {
    await httpClient.POST("/admin-auth/logout");
  },
} as const;
