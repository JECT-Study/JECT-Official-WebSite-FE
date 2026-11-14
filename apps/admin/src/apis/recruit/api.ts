import type { operations } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";

import { applyManagementRecruitsSchema } from "./schemas";

export type ApplyManagementRecruitsQuery =
  operations["searchApplyManagementRecruits"]["parameters"]["query"];

export const recruitApi = {
  getApplyManagementRecruits: async (query: ApplyManagementRecruitsQuery) => {
    const { data } = await httpClient.GET("/admin/recruits/apply-management", {
      params: { query },
    });

    return applyManagementRecruitsSchema.parse(data);
  },
} as const;
