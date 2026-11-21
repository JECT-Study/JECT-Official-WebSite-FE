import { useState } from "react";

import { toastController } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { authApi, type EmailTemplate, type VerifyAuthCodeRequest } from "@/apis/auth/api";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { useIsTimeReached } from "@/hooks/useIsTimeReached";

import { useSendAuthCodeMutation } from "./useSendAuthCodeMutation";

export const AUTH_CODE_VALID_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 180;

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

function showSendFailureToast() {
  toastController.destructive("인증번호 발송 실패", {
    description: "일시적 오류일 수 있으니 다시 시도해주세요.",
  });
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
      setIsMismatch(false);
      onSent();
      toastController.basic("인증번호 발송됨", {
        description: `재발송 요청은 ${RESEND_COOLDOWN_SECONDS / 60}분 뒤에 가능합니다.`,
      });
    },
    onError: showSendFailureToast,
  });

  const verifyMutation = useMutation({
    mutationFn: (request: VerifyAuthCodeRequest) => authApi.verifyAuthCode(request, template),
    onError: (error) => {
      if (hasErrorCode(error, "AUTH-1") || hasErrorCode(error, "AUTH-2")) {
        setIsMismatch(true);
        return;
      }

      toastController.destructive("인증 시도 실패", {
        description: "일시적 오류일 수 있으니 다시 시도해주세요.",
      });
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
