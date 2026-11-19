"use client";

import { useState } from "react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, LabelButton, toastController } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyApi } from "@/apis/apply/api";
import type { ApplyStatus } from "@/apis/apply/schemas";
import { JECT_EMAIL } from "@/constants/links";
import { routeTo } from "@/constants/routes";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { isRecruitClosedError } from "@/errors/isRecruitClosedError";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { PinField } from "@/features/apply/PinField";
import { RecruitClosedDialog } from "@/features/apply/RecruitClosedDialog";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { useLoginWithPinMutation } from "@/hooks/auth/useLoginWithPinMutation";

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
  const [isSubmittedDialogOpen, setIsSubmittedDialogOpen] = useState(false);
  const [isInProgressDialogOpen, setIsInProgressDialogOpen] = useState(false);
  const [isClosedDialogOpen, setIsClosedDialogOpen] = useState(false);

  const form = useForm<IdentityVerificationFormValues>({
    resolver: zodResolver(identityVerificationFormSchema),
    mode: "onTouched",
    defaultValues: { email: "", pin: "" },
  });

  const moveToStep = (step: ContinueStep) => {
    toastController.positive("본인 확인 완료", {
      description: "이제 지원서를 이어서 작성할 수 있어요.",
    });
    onNext(step);
  };

  const checkStatusMutation = useMutation({
    mutationFn: applyApi.getApplyStatus,
    onSuccess: (status) => {
      const step = CONTINUE_STEP[status];

      if (step === null) {
        setIsSubmittedDialogOpen(true);
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
        setIsClosedDialogOpen(true);
        return;
      }

      toastController.destructive("지원 상태 확인 실패", {
        description: "일시적 오류일 수 있으니 다시 시도해주세요.",
      });
    },
  });

  const loginMutation = useLoginWithPinMutation({
    onSuccess: () => checkStatusMutation.mutate(recruitId),
    onError: (error) => {
      if (hasErrorCode(error, "AUTH-5") || hasErrorCode(error, "APPLICANT-1")) {
        setIsMismatch(true);
        return;
      }

      if (hasErrorCode(error, "APPLY-12")) {
        setIsInProgressDialogOpen(true);
        return;
      }

      toastController.destructive("본인 확인 실패", {
        description: "일시적 오류일 수 있으니 다시 시도해주세요.",
      });
    },
  });

  const handleLogin = ({ email, pin }: IdentityVerificationFormValues) => {
    loginMutation.mutate({ email, pin, recruitId });
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

      <Dialog
        open={isSubmittedDialogOpen}
        onOpenChange={setIsSubmittedDialogOpen}
        header="이미 지원서가 접수된 이메일입니다"
        body={
          <>
            접수된 지원서는 수정하거나 취소할 수 없어요.
            <br />
            내용 수정, 지원 취소 등은 다음의 연락처로 문의 부탁드립니다.
            <br />
            문의: {JECT_EMAIL}
          </>
        }
        primaryAction={{ children: "확인", onClick: () => setIsSubmittedDialogOpen(false) }}
      />
      <Dialog
        open={isInProgressDialogOpen}
        onOpenChange={setIsInProgressDialogOpen}
        header="다른 공고에 작성 중인 지원서가 있어요"
        body={
          <>
            이미 다른 공고에서 지원서를 작성하고 있어 이 공고로는 진행할 수 없어요.
            <br />
            작성 중이던 공고에서 이어서 작성해주세요.
          </>
        }
        primaryAction={{ children: "확인", onClick: () => setIsInProgressDialogOpen(false) }}
      />
      <RecruitClosedDialog open={isClosedDialogOpen} recruitId={recruitId} />
    </ApplyStepLayout>
  );
}
