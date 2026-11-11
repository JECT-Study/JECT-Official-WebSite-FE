import type { components } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";

import { submittedAppliesSchema } from "./schemas";

// TODO: sizeOrDefault는 요청 파라미터가 아닌데 스펙에 포함돼 있다. 스펙에서 제거되면 Omit을 지운다.
export type SubmittedAppliesCondition = Omit<
  components["schemas"]["SubmittedApplySearchCondition"],
  "sizeOrDefault"
>;

// 스펙의 condition은 form 방식이라 키를 펼쳐 보내야 하는데, openapi-fetch는 객체 안의 배열을 직렬화하지 못한다.
function serializeCondition({ condition }: { condition: SubmittedAppliesCondition }) {
  const params = new URLSearchParams();

  Object.entries(condition).forEach(([key, value]) => {
    if (value === undefined) return;
    [value].flat().forEach((item) => params.append(key, String(item)));
  });

  return params.toString();
}

export const applyApi = {
  getSubmittedApplies: async (condition: SubmittedAppliesCondition) => {
    const { data } = await httpClient.GET("/admin/applies/submitted", {
      params: { query: { condition } },
      querySerializer: serializeCondition,
    });

    return submittedAppliesSchema.parse(data);
  },
} as const;
