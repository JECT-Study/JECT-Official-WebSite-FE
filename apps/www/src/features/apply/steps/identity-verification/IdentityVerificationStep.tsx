"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { hasErrorCode } from "@ject/api-client";
import { LabelButton } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyApi } from "@/apis/apply/api";
import type { ApplyStatus } from "@/apis/apply/schemas";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { routeTo } from "@/constants/routes";
import { TOAST_CONTENT } from "@/constants/toast";
import { isRecruitClosedError } from "@/errors/isRecruitClosedError";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { PinField } from "@/features/apply/PinField";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { useLoginWithPinMutation } from "@/hooks/auth/useLoginWithPinMutation";
import { showDialog } from "@/stores/dialogStore";
import { showToast } from "@/utils/showToast";

import { EmailField } from "./EmailField";
import { identityVerificationFormSchema, type IdentityVerificationFormValues } from "./schemas";

const MISMATCH_MESSAGE = "이메일 혹은 PIN이 올바르지 않습니다.";

type ContinueStep = "profile" | "application";

const CONTINUE_STEP: Record<ApplyStatus, ContinueStep | null> = {
  JOINED: "application",
  TEMP_SAVED: "application",
  SUBMITTED: null,
  REJECTED: null,
};

interface IdentityVerificationStepProps {
  recruitId: number;
  onNext: (step: ContinueStep) => void;
}

export function IdentityVerificationStep({ recruitId, onNext }: IdentityVerificationStepProps) {
  const [isMismatch, setIsMismatch] = useState(false);
  const router = useRouter();

  const form = useForm<IdentityVerificationFormValues>({
    resolver: zodResolver(identityVerificationFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", pin: "" },
  });

  const moveToGuide = () => router.replace(routeTo.applyGuide(recruitId));

  const moveToStep = (step: ContinueStep) => {
    showToast(TOAST_CONTENT.identityVerified);
    onNext(step);
  };

  const checkStatusMutation = useMutation({ mutationFn: applyApi.getApplyStatus });

  const loginMutation = useLoginWithPinMutation();

  const checkStatus = () => {
    checkStatusMutation.mutate(recruitId, {
      onSuccess: (status) => {
        const step = CONTINUE_STEP[status];

        if (step === null) {
          void showDialog(DIALOG_CONTENT.submittedEmail);
          return;
        }

        moveToStep(step);
      },
      onError: (error) => {
        // 프로필을 저장하기 전에는 지원 정보가 없어 서버가 에러를 반환한다.
        if (hasErrorCode(error, "APPLY-1")) {
          moveToStep("profile");
          return;
        }

        if (isRecruitClosedError(error)) {
          void showDialog(DIALOG_CONTENT.recruitClosed, { closeOnInteractOutside: false }).then(
            (action) => {
              if (action === "primary") {
                moveToGuide();
              }
            }
          );
          return;
        }

        showToast(TOAST_CONTENT.checkApplyStatusFailed);
      },
    });
  };

  const handleLogin = ({ email, pin }: IdentityVerificationFormValues) => {
    loginMutation.mutate(
      { email, pin, recruitId },
      {
        onSuccess: checkStatus,
        onError: (error) => {
          if (hasErrorCode(error, "AUTH-5") || hasErrorCode(error, "APPLICANT-1")) {
            setIsMismatch(true);
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

          showToast(TOAST_CONTENT.verifyIdentityFailed);
        },
      }
    );
  };

  const clearMismatch = () => setIsMismatch(false);

  return (
    <ApplyStepLayout title="지원자 본인 확인">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-margin-3xl"
          noValidate
          onSubmit={form.handleSubmit(handleLogin)}
        >
          <div className="flex flex-col gap-24">
            <EmailField isMismatch={isMismatch} onChange={clearMismatch} />
            <PinField
              label="PIN"
              placeholder="설정했던 PIN을 입력해주세요"
              autoComplete="current-password"
              errorMessage={isMismatch ? MISMATCH_MESSAGE : undefined}
              onChange={clearMismatch}
            />
            <LabelButton asChild hierarchy="tertiary" size="sm" suffixIcon="chevron-right">
              <Link href={routeTo.resetPin(recruitId)} className="self-start">
                PIN 번호를 잊어버리셨나요?
              </Link>
            </LabelButton>
          </div>

          <StepSubmitButton
            disabled={isMismatch || loginMutation.isPending || checkStatusMutation.isPending}
          />
        </form>
      </FormProvider>
    </ApplyStepLayout>
  );
}
