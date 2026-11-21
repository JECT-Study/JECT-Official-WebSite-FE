"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LabelButton, toastController } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { authApi } from "@/apis/auth/api";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { routeTo } from "@/constants/routes";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { AuthCodeField } from "@/features/apply/AuthCodeField";
import { EmailField } from "@/features/apply/EmailField";
import { PinField } from "@/features/apply/PinField";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { useRegisterApplicantMutation } from "@/hooks/applicant/useRegisterApplicantMutation";
import {
  AUTH_CODE_VALID_SECONDS,
  useAuthCodeVerification,
} from "@/hooks/auth/useAuthCodeVerification";
import { showDialog } from "@/stores/dialogStore";

import { emailVerificationFormSchema, type EmailVerificationFormValues } from "./schemas";
import { TermsField } from "./TermsField";

interface EmailVerificationStepProps {
  recruitId: number;
  onNext: () => void;
}

export function EmailVerificationStep({ recruitId, onNext }: EmailVerificationStepProps) {
  const router = useRouter();
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

  const verification = useAuthCodeVerification({
    recruitId,
    template: "AUTH_CODE",
    onSent: () => form.resetField("authCode"),
    onVerified: (email) => form.setValue("email", email, { shouldValidate: true }),
  });

  const checkMemberMutation = useMutation({
    mutationFn: (email: string) => authApi.isExistMember(email, recruitId),
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

        verification.send(email);
      },
      onError: () => {
        toastController.destructive("인증번호 발송 실패", {
          description: "일시적 오류일 수 있으니 다시 시도해주세요.",
        });
      },
    });
  };

  const handleVerify = async () => {
    if (await form.trigger("authCode")) {
      verification.verify(form.getValues("authCode"));
    }
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
              isVerified={verification.isVerified}
              coolingDownEmail={verification.coolingDownEmail}
              isPending={checkMemberMutation.isPending || verification.isSending}
              onSend={handleSend}
            />

            {verification.deadline !== null && (
              <AuthCodeField
                deadline={verification.deadline}
                validSeconds={AUTH_CODE_VALID_SECONDS}
                status={verification.authCodeStatus}
                onVerify={handleVerify}
                onChange={verification.clearMismatch}
              />
            )}

            {verification.sentEmail !== null && !verification.isVerified && (
              <LabelButton asChild hierarchy="tertiary" size="sm" suffixIcon="chevron-right">
                <Link href={routeTo.faq("1", "apply-5")} target="_blank" className="self-start">
                  인증번호를 받지 못하셨나요?
                </Link>
              </LabelButton>
            )}

            {verification.isVerified && (
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

          <StepSubmitButton disabled={!verification.isVerified || registerMutation.isPending} />
        </form>
      </FormProvider>
    </ApplyStepLayout>
  );
}
