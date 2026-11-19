import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { applyApi, type ApplyTemporaryRequest } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";

interface SaveTempApplicationVariables {
  recruitId: number;
  request: ApplyTemporaryRequest;
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
        queryKey: applyQueries.tempApplication(variables.recruitId).queryKey,
      });
      options?.onSuccess?.(data, variables, ...rest);
    },
  });
}
