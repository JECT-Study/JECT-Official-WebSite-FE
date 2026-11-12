import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { applicantApi } from "@/apis/applicant/api";
import { applyQueryKeys } from "@/apis/apply/queryKeys";

type RegisterRequest = components["schemas"]["RegisterRequest"];

export function useRegisterApplicantMutation(
  options?: Omit<UseMutationOptions<boolean, Error, RegisterRequest>, "mutationFn">
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: applicantApi.register,
    onSuccess: (data, variables, ...rest) => {
      queryClient.removeQueries({ queryKey: applyQueryKeys.tempApplications() });
      options?.onSuccess?.(data, variables, ...rest);
    },
  });
}
