import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { applicantApi } from "@/apis/applicant/api";

type RegisterRequest = components["schemas"]["RegisterRequest"];

export function useRegisterApplicantMutation(
  options?: Omit<UseMutationOptions<boolean, Error, RegisterRequest>, "mutationFn">
) {
  return useMutation({
    ...options,
    mutationFn: applicantApi.register,
  });
}
