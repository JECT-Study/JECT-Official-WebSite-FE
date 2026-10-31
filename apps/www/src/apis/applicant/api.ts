import type { components } from "@ject/api-types/core";
import { z } from "zod";

import { httpClient } from "@/apis/httpClient/client";
import { API_ENDPOINTS } from "@/constants/endpoints";

export const applicantApi = {
  register: (request: components["schemas"]["RegisterRequest"]) =>
    httpClient.post(API_ENDPOINTS.registerApplicant, request, z.boolean()),
} as const;
