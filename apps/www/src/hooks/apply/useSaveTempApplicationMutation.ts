import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueryKeys } from "@/apis/apply/queryKeys";

interface SaveTempApplicationVariables {
  recruitId: number;
  request: components["schemas"]["ApplyTemporaryRequest"];
}

export function useSaveTempApplicationMutation(
  options?: Omit<UseMutationOptions<unknown, Error, SaveTempApplicationVariables>, "mutationFn">
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ recruitId, request }) => applyApi.saveTempApplication(recruitId, request),
    onSuccess: (data, variables, ...rest) => {
      void queryClient.invalidateQueries({
        queryKey: applyQueryKeys.tempApplication(variables.recruitId),
      });
      options?.onSuccess?.(data, variables, ...rest);
    },
  });
}
