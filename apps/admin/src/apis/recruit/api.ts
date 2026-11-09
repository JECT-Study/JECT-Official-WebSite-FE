import type { operations } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";
import { API_ENDPOINTS } from "@/constants/endpoints";

import { applyManagementRecruitsSchema } from "./schemas";

export type ApplyManagementRecruitsQuery =
  operations["searchApplyManagementRecruits"]["parameters"]["query"];

export const recruitApi = {
  getApplyManagementRecruits: ({
    status,
    recruitType,
    jobFamilies = [],
    cursor,
    size,
  }: ApplyManagementRecruitsQuery) => {
    const params = new URLSearchParams({ status, recruitType });

    jobFamilies.forEach((jobFamily) => params.append("jobFamilies", jobFamily));
    if (cursor !== undefined) params.set("cursor", String(cursor));
    if (size !== undefined) params.set("size", String(size));

    return httpClient.get(
      `${API_ENDPOINTS.applyManagementRecruits}?${params}`,
      applyManagementRecruitsSchema
    );
  },
} as const;
