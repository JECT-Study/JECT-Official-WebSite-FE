import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { authApi, type EmailTemplate } from "@/apis/auth/api";
import { TOAST_CONTENT } from "@/constants/toast";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { showToast } from "@/utils/showToast";

interface SendAuthCodeVariables {
  email: string;
  template: EmailTemplate;
}

export function useSendAuthCodeMutation(
  options?: Omit<UseMutationOptions<unknown, Error, SendAuthCodeVariables>, "mutationFn">
) {
  return useMutation({
    ...options,
    mutationFn: ({ email, template }) => authApi.sendAuthCode(email, template),
    onError: (error, ...rest) => {
      if (hasErrorCode(error, "EMAIL-4")) {
        showToast(TOAST_CONTENT.sendAuthCodeLimited);
        return;
      }

      options?.onError?.(error, ...rest);
    },
  });
}
