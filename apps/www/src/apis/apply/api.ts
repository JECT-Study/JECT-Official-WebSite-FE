import type { components } from "@ject/api-types/core";

import { httpClient } from "@/apis/httpClient/client";
import { API_ENDPOINTS } from "@/constants/endpoints";

export const applyApi = {
  saveProfile: (recruitId: number, request: components["schemas"]["ApplyProfileRequest"]) =>
    httpClient.post(
      `${API_ENDPOINTS.applyProfile}?${new URLSearchParams({ recruitId: String(recruitId) })}`,
      request
    ),
} as const;
