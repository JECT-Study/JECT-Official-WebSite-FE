import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";

interface SubmitApplicationVariables {
  recruitId: number;
  request: components["schemas"]["SubmitApplicationRequest"];
}

export function useSubmitApplicationMutation(
  options?: Omit<UseMutationOptions<unknown, Error, SubmitApplicationVariables>, "mutationFn">
) {
  return useMutation({
    ...options,
    mutationFn: ({ recruitId, request }) => applyApi.submitApplication(recruitId, request),
  });
}
