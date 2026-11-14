import type { components, operations } from "@ject/api-types/core";
import { z } from "zod";

import { httpClient } from "@/apis/httpClient/client";

export type EmailTemplate = operations["sendAuthEmail"]["parameters"]["query"]["sendGroupCode"];

export const authApi = {
  isExistMember: async (email: string, recruitId: number) => {
    const { data } = await httpClient.GET("/auth/login/exist", {
      params: { query: { email, recruitId } },
    });

    return z.boolean().parse(data);
  },

  sendAuthCode: async (email: string, template: EmailTemplate) => {
    await httpClient.POST("/email/send/auth", {
      params: { query: { email, sendGroupCode: template } },
    });
  },

  verifyAuthCode: async (
    request: components["schemas"]["VerifyAuthCodeRequest"],
    template: EmailTemplate
  ) => {
    const { data } = await httpClient.POST("/auth/code", {
      params: { query: { template } },
      body: request,
    });

    return z.boolean().parse(data);
  },

  loginWithPin: async (request: components["schemas"]["PinLoginRequest"]) => {
    const { data } = await httpClient.POST("/auth/login/pin", { body: request });

    return z.boolean().parse(data);
  },
} as const;
