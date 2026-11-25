import type { components } from "@ject/api-types/admin";

import { conditionQuerySerializer } from "@/apis/condition";
import { httpClient } from "@/apis/httpClient";

import { deletedAppliesCountSchema, submittedAppliesSchema } from "./schemas";

// TODO: sizeOrDefault는 요청 파라미터가 아닌데 스펙에 포함돼 있다. 스펙에서 제거되면 Omit을 지운다.
export type SubmittedAppliesCondition = Omit<
  components["schemas"]["SubmittedApplySearchCondition"],
  "sizeOrDefault"
>;

type UpdateSelectionResultsRequest = components["schemas"]["UpdateSelectionResultsRequest"];
type DeleteSubmittedAppliesRequest = components["schemas"]["SubmittedApplyBulkDeleteRequest"];

export const applyApi = {
  getSubmittedApplies: async (condition: SubmittedAppliesCondition) => {
    const { data } = await httpClient.GET("/admin/applies/submitted", {
      params: { query: { condition } },
      querySerializer: conditionQuerySerializer,
    });

    return submittedAppliesSchema.parse(data);
  },

  updateSelectionResults: async (body: UpdateSelectionResultsRequest) => {
    await httpClient.PATCH("/admin/applies/selection-results", { body });
  },

  deleteSubmittedApplies: async (body: DeleteSubmittedAppliesRequest) => {
    const { data } = await httpClient.DELETE("/admin/applies", { body });

    return deletedAppliesCountSchema.parse(data);
  },
} as const;
