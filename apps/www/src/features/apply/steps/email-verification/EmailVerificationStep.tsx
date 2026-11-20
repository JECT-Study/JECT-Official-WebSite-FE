"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LabelButton, toastController } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { authApi, type VerifyAuthCodeRequest } from "@/apis/auth/api";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { routeTo } from "@/constants/routes";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { PinField } from "@/features/apply/PinField";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { useRegisterApplicantMutation } from "@/hooks/applicant/useRegisterApplicantMutation";
import { useSendAuthCodeMutation } from "@/hooks/auth/useSendAuthCodeMutation";
import { useIsTimeReached } from "@/hooks/useIsTimeReached";
import { showDialog } from "@/stores/dialogStore";

import { AuthCodeField, type AuthCodeStatus } from "./AuthCodeField";
import { EmailField } from "./EmailField";
import { emailVerificationFormSchema, type EmailVerificationFormValues } from "./schemas";
import { TermsField } from "./TermsField";

const AUTH_CODE_VALID_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 180;

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

interface EmailVerificationStepProps {
  recruitId: number;
  onNext: () => void;
}

export function EmailVerificationStep({ recruitId, onNext }: EmailVerificationStepProps) {
  const router = useRouter();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isAuthCodeMismatch, setIsAuthCodeMismatch] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);

  const form = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", authCode: "", pin: "", agreedTerms: [] },
  });

  const openExistingApplicantDialog = async () => {
    if ((await showDialog(DIALOG_CONTENT.existingApplicant)) === "primary") {
      router.push(routeTo.applyContinue(recruitId));
    }
  };

  const showSendFailureToast = () => {
    toastController.destructive("인증번호 발송 실패", {
      description: "일시적 오류일 수 있으니 다시 시도해주세요.",
    });
  };

  const sendMutation = useSendAuthCodeMutation({
    onSuccess: (_, { email }) => {
      setSentEmail(email);
      setSentAt(Date.now());
      form.resetField("authCode");
      setIsAuthCodeMismatch(false);
      toastController.basic("인증번호 발송됨", {
        description: `재발송 요청은 ${RESEND_COOLDOWN_SECONDS / 60}분 뒤에 가능합니다.`,
      });
    },
    onError: showSendFailureToast,
  });

  const checkMemberMutation = useMutation({
    mutationFn: (email: string) => authApi.isExistMember(email, recruitId),
  });

  const verifyMutation = useMutation({
    mutationFn: (request: VerifyAuthCodeRequest) => authApi.verifyAuthCode(request, "AUTH_CODE"),
    onError: (error) => {
      if (hasErrorCode(error, "AUTH-1") || hasErrorCode(error, "AUTH-2")) {
        setIsAuthCodeMismatch(true);
        return;
      }

      toastController.destructive("인증 시도 실패", {
        description: "일시적 오류일 수 있으니 다시 시도해주세요.",
      });
    },
  });

  const registerMutation = useRegisterApplicantMutation();

  const handleSend = async () => {
    if (!(await form.trigger("email"))) {
      return;
    }

    checkMemberMutation.mutate(form.getValues("email"), {
      onSuccess: (isExistMember, email) => {
        if (isExistMember) {
          void openExistingApplicantDialog();
          return;
        }

        sendMutation.mutate({ email, template: "AUTH_CODE" });
      },
      onError: showSendFailureToast,
    });
  };

  const handleVerify = async () => {
    if (sentEmail === null || !(await form.trigger("authCode"))) {
      return;
    }

    verifyMutation.mutate(
      {
        email: sentEmail,
        authCode: form.getValues("authCode").trim(),
        recruitId,
      },
      {
        onSuccess: () => {
          form.setValue("email", sentEmail, { shouldValidate: true });
          setIsVerified(true);
        },
      }
    );
  };

  const handleRegister = ({ pin }: EmailVerificationFormValues) => {
    registerMutation.mutate(
      { pin, recruitId },
      {
        onSuccess: onNext,
        onError: (error) => {
          if (hasErrorCode(error, "APPLICANT-2")) {
            void openExistingApplicantDialog();
            return;
          }

          if (hasErrorCode(error, "APPLY-12")) {
            void showDialog(DIALOG_CONTENT.applicationInProgress);
            return;
          }

          if (hasErrorCode(error, "APPLY-18")) {
            void showDialog(DIALOG_CONTENT.activeMember);
            return;
          }

          toastController.destructive("PIN 설정 실패", {
            description: "일시적 오류일 수 있으니 다시 시도해주세요.",
          });
        },
      }
    );
  };

  const deadline = sentAt === null ? null : sentAt + AUTH_CODE_VALID_SECONDS * 1000;
  const isExpired = useIsTimeReached(deadline);
  const authCodeStatus = getAuthCodeStatus({
    isVerified,
    isExpired,
    isPending: verifyMutation.isPending,
    isMismatch: isAuthCodeMismatch,
  });
  const canResend = useIsTimeReached(
    sentAt === null ? null : sentAt + RESEND_COOLDOWN_SECONDS * 1000
  );

  return (
    <ApplyStepLayout title="이메일 인증">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-margin-3xl"
          noValidate
          onSubmit={form.handleSubmit(handleRegister)}
        >
          <div className="flex flex-col gap-24">
            <EmailField
              isVerified={isVerified}
              coolingDownEmail={canResend ? null : sentEmail}
              isPending={checkMemberMutation.isPending || sendMutation.isPending}
              onSend={handleSend}
            />

            {deadline !== null && (
              <AuthCodeField
                deadline={deadline}
                validSeconds={AUTH_CODE_VALID_SECONDS}
                status={authCodeStatus}
                onVerify={handleVerify}
                onChange={() => setIsAuthCodeMismatch(false)}
              />
            )}

            {sentEmail !== null && !isVerified && (
              <LabelButton asChild hierarchy="tertiary" size="sm" suffixIcon="chevron-right">
                <Link href={routeTo.faq("1", "apply-5")} target="_blank" className="self-start">
                  인증번호를 받지 못하셨나요?
                </Link>
              </LabelButton>
            )}

            {isVerified && (
              <>
                <PinField
                  label="PIN 설정"
                  placeholder="6자리 숫자를 입력해주세요"
                  autoComplete="new-password"
                />
                <TermsField />
              </>
            )}
          </div>

          <StepSubmitButton disabled={!isVerified || registerMutation.isPending} />
        </form>
      </FormProvider>
    </ApplyStepLayout>
  );
}
