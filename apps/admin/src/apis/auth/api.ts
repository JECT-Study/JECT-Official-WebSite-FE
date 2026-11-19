import type { components } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";

import { loginResponseSchema } from "./schemas";

type LoginRequest = components["schemas"]["AdminLoginRequest"];

export const authApi = {
  login: async (body: LoginRequest) => {
    const { data } = await httpClient.POST("/admin-auth/login", { body });

    return loginResponseSchema.parse(data);
  },

  logout: async () => {
    await httpClient.POST("/admin-auth/logout");
  },
} as const;
