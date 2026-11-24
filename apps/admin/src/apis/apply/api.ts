import type { components } from "@ject/api-types/admin";

import { conditionQuerySerializer } from "@/apis/condition";
import { httpClient } from "@/apis/httpClient";

import { applyDetailSchema, deletedAppliesCountSchema, submittedAppliesSchema } from "./schemas";

// TODO: sizeOrDefault는 요청 파라미터가 아닌데 스펙에 포함돼 있다. 스펙에서 제거되면 Omit을 지운다.
export type SubmittedAppliesCondition = Omit<
  components["schemas"]["SubmittedApplySearchCondition"],
  "sizeOrDefault"
>;

type UpdateSelectionResultsRequest = components["schemas"]["UpdateSelectionResultsRequest"];
export type EditApplyRequest = components["schemas"]["EditApplyRequest"];
type DeleteSubmittedAppliesRequest = components["schemas"]["SubmittedApplyBulkDeleteRequest"];

export const applyApi = {
  getSubmittedApplies: async (condition: SubmittedAppliesCondition) => {
    const { data } = await httpClient.GET("/admin/applies/submitted", {
      params: { query: { condition } },
      querySerializer: conditionQuerySerializer,
    });

    return submittedAppliesSchema.parse(data);
  },

  getApply: async (applyId: number) => {
    const { data } = await httpClient.GET("/admin/applies/{applyId}", {
      params: { path: { applyId } },
    });

    return applyDetailSchema.parse(data);
  },

  editApply: async (applyId: number, body: EditApplyRequest) => {
    await httpClient.PUT("/admin/applies/{applyId}", { params: { path: { applyId } }, body });
  },

  deleteApply: async (applyId: number) => {
    await httpClient.DELETE("/admin/applies/{applyId}", { params: { path: { applyId } } });
  },

  updateSelectionResults: async (body: UpdateSelectionResultsRequest) => {
    await httpClient.PATCH("/admin/applies/selection-results", { body });
  },

  deleteSubmittedApplies: async (body: DeleteSubmittedAppliesRequest) => {
    const { data } = await httpClient.DELETE("/admin/applies", { body });

    return deletedAppliesCountSchema.parse(data);
  },
} as const;
