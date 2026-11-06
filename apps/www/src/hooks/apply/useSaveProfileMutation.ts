import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";

interface SaveProfileVariables {
  recruitId: number;
  request: components["schemas"]["ApplyProfileRequest"];
}

export function useSaveProfileMutation(
  options?: Omit<UseMutationOptions<unknown, Error, SaveProfileVariables>, "mutationFn">
) {
  return useMutation({
    ...options,
    mutationFn: ({ recruitId, request }) => applyApi.saveProfile(recruitId, request),
  });
}
