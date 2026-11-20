import type { components } from "@ject/api-types/admin";

import { conditionQuerySerializer } from "@/apis/condition";
import { httpClient } from "@/apis/httpClient";

import { submittedAppliesSchema } from "./schemas";

// TODO: sizeOrDefault는 요청 파라미터가 아닌데 스펙에 포함돼 있다. 스펙에서 제거되면 Omit을 지운다.
export type SubmittedAppliesCondition = Omit<
  components["schemas"]["SubmittedApplySearchCondition"],
  "sizeOrDefault"
>;

export const applyApi = {
  getSubmittedApplies: async (condition: SubmittedAppliesCondition) => {
    const { data } = await httpClient.GET("/admin/applies/submitted", {
      params: { query: { condition } },
      querySerializer: conditionQuerySerializer,
    });

    return submittedAppliesSchema.parse(data);
  },
} as const;
