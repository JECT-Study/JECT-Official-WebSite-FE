import { toastController } from "@jects/jds";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { authApi, type EmailTemplate } from "@/apis/auth/api";
import { hasErrorCode } from "@/errors/hasErrorCode";

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
      if (hasErrorCode(error, "TOO_MANY_EMAIL_REQUESTS")) {
        toastController.destructive("인증번호 발송 제한", {
          description: "잠시 후 다시 시도해주세요.",
        });
        return;
      }

      options?.onError?.(error, ...rest);
    },
  });
}
