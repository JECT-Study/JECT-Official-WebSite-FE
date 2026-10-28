import type { components, operations } from "@ject/api-types/core";
import { z } from "zod";

import { httpClient } from "@/apis/httpClient/client";
import { API_ENDPOINTS } from "@/constants/endpoints";

type EmailTemplate = operations["sendAuthEmail"]["parameters"]["query"]["sendGroupCode"];

export const authApi = {
  isExistMember: (email: string, recruitId: number) =>
    httpClient.get(
      `${API_ENDPOINTS.memberExists}?${new URLSearchParams({ email, recruitId: String(recruitId) })}`,
      z.boolean()
    ),

  sendAuthCode: (email: string, template: EmailTemplate) =>
    httpClient.post(
      `${API_ENDPOINTS.sendAuthCode}?${new URLSearchParams({ email, sendGroupCode: template })}`
    ),

  verifyAuthCode: (
    request: components["schemas"]["VerifyAuthCodeRequest"],
    template: EmailTemplate
  ) =>
    httpClient.post(
      `${API_ENDPOINTS.verifyAuthCode}?${new URLSearchParams({ template })}`,
      request
    ),
} as const;
