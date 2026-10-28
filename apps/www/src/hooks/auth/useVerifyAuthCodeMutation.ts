import type { components } from "@ject/api-types/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { authApi, type EmailTemplate } from "@/apis/auth/api";

type VerifyAuthCodeRequest = components["schemas"]["VerifyAuthCodeRequest"];

interface VerifyAuthCodeVariables extends VerifyAuthCodeRequest {
  template: EmailTemplate;
}

export function useVerifyAuthCodeMutation(
  options?: Omit<UseMutationOptions<unknown, Error, VerifyAuthCodeVariables>, "mutationFn">
) {
  return useMutation({
    ...options,
    mutationFn: ({ template, ...request }) => authApi.verifyAuthCode(request, template),
  });
}
