import type { components } from "@ject/api-types/core";
import { z } from "zod";

import { httpClient } from "@/apis/httpClient/client";

export const applicantApi = {
  register: async (request: components["schemas"]["RegisterRequest"]) => {
    const { data } = await httpClient.POST("/applicants/apply", { body: request });

    return z.boolean().parse(data);
  },
} as const;
