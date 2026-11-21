"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { BlockButton, LabelButton, toastController } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { applicantApi } from "@/apis/applicant/api";
import { authApi } from "@/apis/auth/api";
import { AUTH_CODE_VALID_SECONDS } from "@/constants/auth";
import { routeTo } from "@/constants/routes";
import { ApplyFunnelHeader } from "@/features/apply/ApplyFunnelHeader";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { AuthCodeField } from "@/features/apply/AuthCodeField";
import { EmailField } from "@/features/apply/EmailField";
import { PinField } from "@/features/apply/PinField";
import { useAuthCodeVerification } from "@/hooks/auth/useAuthCodeVerification";

import { resetPinFormSchema, type ResetPinFormValues } from "./schemas";

interface ResetPinProps {
  recruitId: number;
}

export function ResetPin({ recruitId }: ResetPinProps) {
  const router = useRouter();
  const [unregisteredEmail, setUnregisteredEmail] = useState<string | null>(null);

  const form = useForm<ResetPinFormValues>({
    resolver: zodResolver(resetPinFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", authCode: "", pin: "" },
  });
  const email = useWatch({ control: form.control, name: "email" });
  const { isValid } = form.formState;
  const isUnregistered = unregisteredEmail !== null && email === unregisteredEmail;

  const verification = useAuthCodeVerification({
    recruitId,
    template: "PIN_RESET",
    onSent: () => form.resetField("authCode"),
    onVerified: (verifiedEmail) => form.setValue("email", verifiedEmail, { shouldValidate: true }),
  });

  const checkMemberMutation = useMutation({
    mutationFn: (email: string) => authApi.isExistMember(email, recruitId),
  });

  const resetMutation = useMutation({ mutationFn: applicantApi.resetPin });

  const handleSend = async () => {
    if (!(await form.trigger("email"))) {
      return;
    }

    checkMemberMutation.mutate(form.getValues("email"), {
      onSuccess: (isExistMember, email) => {
        if (!isExistMember) {
          setUnregisteredEmail(email);
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

  const handleReset = ({ pin }: ResetPinFormValues) => {
    resetMutation.mutate(
      { pin },
      {
        onSuccess: () => {
          toastController.positive("PIN 재설정 완료", {
            description: "새로운 PIN을 입력해 본인 확인을 다시 진행해주세요.",
          });
          router.replace(routeTo.applyContinue(recruitId));
        },
        onError: () => {
          toastController.destructive("PIN 재설정 실패", {
            description: "일시적 오류일 수 있으니 다시 시도해주세요.",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-48">
      <ApplyFunnelHeader
        recruitId={recruitId}
        navigationTitle="PIN 재설정"
        onBack={() => router.push(routeTo.applyContinue(recruitId))}
      />
      <ApplyStepLayout title="이메일 인증">
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-margin-3xl"
            noValidate
            onSubmit={form.handleSubmit(handleReset)}
          >
            <div className="flex flex-col gap-24">
              <EmailField
                isVerified={verification.isVerified}
                coolingDownEmail={verification.coolingDownEmail}
                isPending={checkMemberMutation.isPending || verification.isSending}
                errorMessage={isUnregistered ? "등록되지 않은 이메일 주소입니다." : undefined}
                onSend={handleSend}
              />

              {isUnregistered && (
                <LabelButton asChild hierarchy="accent" size="md" suffixIcon="arrow-right">
                  <Link href={routeTo.applyFunnel(recruitId)} className="self-start">
                    새로운 지원서를 작성할까요?
                  </Link>
                </LabelButton>
              )}

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
                <PinField
                  label="새로운 PIN 설정"
                  placeholder="새로운 6자리 숫자 비밀번호"
                  autoComplete="new-password"
                />
              )}
            </div>

            <BlockButton
              type="submit"
              hierarchy="accent"
              size="md"
              className="self-start"
              disabled={!verification.isVerified || !isValid || resetMutation.isPending}
            >
              PIN 재설정 완료하기
            </BlockButton>
          </form>
        </FormProvider>
      </ApplyStepLayout>
    </div>
  );
}
