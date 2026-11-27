import { useState } from "react";

import { hasErrorCode } from "@ject/api-client";
import { useMutation } from "@tanstack/react-query";

import { authApi, type EmailTemplate, type VerifyAuthCodeRequest } from "@/apis/auth/api";
import { AUTH_CODE_VALID_SECONDS, RESEND_COOLDOWN_SECONDS } from "@/constants/auth";
import { TOAST_CONTENT } from "@/constants/toast";
import { useIsTimeReached } from "@/hooks/useIsTimeReached";
import { showToast } from "@/utils/showToast";

import { useSendAuthCodeMutation } from "./useSendAuthCodeMutation";

export type AuthCodeStatus = "idle" | "pending" | "verified" | "expired" | "mismatch";

interface AuthCodeStatusParams {
  isVerified: boolean;
  isExpired: boolean;
  isPending: boolean;
  isMismatch: boolean;
}

function getAuthCodeStatus({
  isVerified,
  isExpired,
  isPending,
  isMismatch,
}: AuthCodeStatusParams): AuthCodeStatus {
  if (isVerified) {
    return "verified";
  }

  if (isExpired) {
    return "expired";
  }

  if (isPending) {
    return "pending";
  }

  if (isMismatch) {
    return "mismatch";
  }

  return "idle";
}

interface UseAuthCodeVerificationOptions {
  recruitId: number;
  template: EmailTemplate;
  onSent: () => void;
  onVerified: (email: string) => void;
}

export function useAuthCodeVerification({
  recruitId,
  template,
  onSent,
  onVerified,
}: UseAuthCodeVerificationOptions) {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isMismatch, setIsMismatch] = useState(false);

  const sendMutation = useSendAuthCodeMutation({
    onSuccess: (_, { email }) => {
      setSentEmail(email);
      setSentAt(Date.now());
      setIsVerified(false);
      setIsMismatch(false);
      onSent();
      showToast(TOAST_CONTENT.authCodeSent);
    },
    onError: () => showToast(TOAST_CONTENT.sendAuthCodeFailed),
  });

  const verifyMutation = useMutation({
    mutationFn: (request: VerifyAuthCodeRequest) => authApi.verifyAuthCode(request, template),
    onError: (error) => {
      if (hasErrorCode(error, "AUTH-1") || hasErrorCode(error, "AUTH-2")) {
        setIsMismatch(true);
        return;
      }

      showToast(TOAST_CONTENT.verifyAuthCodeFailed);
    },
  });

  const deadline = sentAt === null ? null : sentAt + AUTH_CODE_VALID_SECONDS * 1000;
  const isExpired = useIsTimeReached(deadline);
  const canResend = useIsTimeReached(
    sentAt === null ? null : sentAt + RESEND_COOLDOWN_SECONDS * 1000
  );

  return {
    sentEmail,
    isVerified,
    deadline,
    coolingDownEmail: canResend ? null : sentEmail,
    isSending: sendMutation.isPending,
    authCodeStatus: getAuthCodeStatus({
      isVerified,
      isExpired,
      isPending: verifyMutation.isPending,
      isMismatch,
    }),
    send: (email: string) => sendMutation.mutate({ email, template }),
    verify: (authCode: string) => {
      if (sentEmail === null) {
        return;
      }

      verifyMutation.mutate(
        { email: sentEmail, authCode: authCode.trim(), recruitId },
        {
          onSuccess: () => {
            setIsVerified(true);
            onVerified(sentEmail);
          },
        }
      );
    },
    clearMismatch: () => setIsMismatch(false),
  };
}
