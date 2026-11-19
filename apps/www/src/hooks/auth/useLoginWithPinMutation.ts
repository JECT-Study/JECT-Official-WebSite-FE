import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { applyQueryKeys } from "@/apis/apply/queryKeys";
import { authApi } from "@/apis/auth/api";

export function useLoginWithPinMutation(
  options?: Omit<
    UseMutationOptions<boolean, Error, components["schemas"]["PinLoginRequest"]>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: authApi.loginWithPin,
    onSuccess: (data, variables, ...rest) => {
      queryClient.removeQueries({ queryKey: applyQueryKeys.tempApplications() });
      options?.onSuccess?.(data, variables, ...rest);
    },
  });
}
