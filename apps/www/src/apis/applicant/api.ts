import type { components } from "@ject/api-types/core";
import { z } from "zod";

import { httpClient } from "@/apis/httpClient/client";

export type RegisterRequest = components["schemas"]["RegisterRequest"];

export type UpdatePinRequest = components["schemas"]["UpdatePinRequest"];

export const applicantApi = {
  register: async (request: RegisterRequest) => {
    const { data } = await httpClient.POST("/applicants/apply", { body: request });

    return z.boolean().parse(data);
  },

  resetPin: async (request: UpdatePinRequest) => {
    await httpClient.PUT("/applicants/pin", { body: request });
  },
} as const;
