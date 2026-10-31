"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, LabelButton, toastController } from "@jects/jds";
import { FormProvider, useForm } from "react-hook-form";

import { routeTo } from "@/constants/routes";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { useRegisterApplicantMutation } from "@/hooks/applicant/useRegisterApplicantMutation";
import { useCheckMemberExistsMutation } from "@/hooks/auth/useCheckMemberExistsMutation";
import { useSendAuthCodeMutation } from "@/hooks/auth/useSendAuthCodeMutation";
import { useVerifyAuthCodeMutation } from "@/hooks/auth/useVerifyAuthCodeMutation";
import { useIsTimeReached } from "@/hooks/useIsTimeReached";

import { AuthCodeField } from "./AuthCodeField";
import { EmailField } from "./EmailField";
import { PinSetupFields } from "./PinSetupFields";
import { emailVerificationFormSchema, type EmailVerificationFormValues } from "./schemas";

const AUTH_CODE_VALID_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 180;

interface EmailVerificationStepProps {
  recruitId: number;
  onNext: () => void;
}

export function EmailVerificationStep({ recruitId, onNext }: EmailVerificationStepProps) {
  const router = useRouter();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isAuthCodeMismatch, setIsAuthCodeMismatch] = useState(false);
  const [isExistingMemberDialogOpen, setIsExistingMemberDialogOpen] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);

  const form = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", authCode: "", pin: "", agreedTerms: [] },
  });

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

  const checkMemberMutation = useCheckMemberExistsMutation({
    onSuccess: (isExistMember, { email }) => {
      if (isExistMember) {
        setIsExistingMemberDialogOpen(true);
        return;
      }

      sendMutation.mutate({ email, template: "AUTH_CODE" });
    },
    onError: showSendFailureToast,
  });

  const verifyMutation = useVerifyAuthCodeMutation({
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

  const registerMutation = useRegisterApplicantMutation({
    onError: (error) => {
      if (hasErrorCode(error, "APPLICANT-2")) {
        setIsExistingMemberDialogOpen(true);
        return;
      }

      toastController.destructive("PIN 설정 실패", {
        description: "일시적 오류일 수 있으니 다시 시도해주세요.",
      });
    },
  });

  const handleSend = async () => {
    if (await form.trigger("email")) {
      checkMemberMutation.mutate({ email: form.getValues("email"), recruitId });
    }
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
        template: "AUTH_CODE",
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
    registerMutation.mutate({ pin, recruitId }, { onSuccess: onNext });
  };

  const deadline = sentAt === null ? null : sentAt + AUTH_CODE_VALID_SECONDS * 1000;
  const isExpired = useIsTimeReached(deadline) && !isVerified;
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
                isExpired={isExpired}
                isVerified={isVerified}
                isMismatch={isAuthCodeMismatch}
                isPending={verifyMutation.isPending}
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

            {isVerified && <PinSetupFields />}
          </div>

          <StepSubmitButton disabled={!isVerified || registerMutation.isPending} />
        </form>
      </FormProvider>

      <Dialog
        open={isExistingMemberDialogOpen}
        onOpenChange={setIsExistingMemberDialogOpen}
        header="페이지를 이동해 지원서를 이어서 작성합니다"
        body="이미 등록된 이메일은 마지막 작성 단계부터 이어서 작성할 수 있어요."
        primaryAction={{
          children: "페이지 이동하기",
          onClick: () => router.push(routeTo.applyContinue(recruitId)),
        }}
        secondaryAction={{
          children: "닫기",
          onClick: () => setIsExistingMemberDialogOpen(false),
        }}
      />
    </ApplyStepLayout>
  );
}
