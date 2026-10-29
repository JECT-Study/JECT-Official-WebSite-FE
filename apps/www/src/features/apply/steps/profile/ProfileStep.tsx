"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, toastController } from "@jects/jds";
import { FormProvider, useForm } from "react-hook-form";

import type { JobFamily } from "@/apis/recruit/schemas";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { useSaveProfileMutation } from "@/hooks/apply/useSaveProfileMutation";

import { ProfileFields } from "./ProfileFields";
import { profileFormSchema, type ProfileFormValues } from "./schemas";

interface ProfileStepProps {
  recruitId: number;
  jobFamily: JobFamily;
  jobFamilyName: string;
  onNext: () => void;
}

export function ProfileStep({ recruitId, jobFamily, jobFamilyName, onNext }: ProfileStepProps) {
  const [pendingProfile, setPendingProfile] = useState<ProfileFormValues | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onTouched",
    defaultValues: { name: "", phoneNumber: "", interestedDomains: [] },
  });

  const saveMutation = useSaveProfileMutation({
    onError: () => {
      toastController.destructive("프로필 저장 실패", {
        description: "일시적 오류일 수 있으니 다시 시도해주세요.",
      });
    },
  });

  const handleConfirm = () => {
    if (pendingProfile === null) {
      return;
    }

    saveMutation.mutate(
      { recruitId, request: { ...pendingProfile, jobFamily } },
      { onSuccess: onNext }
    );
    setPendingProfile(null);
  };

  return (
    <ApplyStepLayout title="프로필 작성">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-margin-3xl"
          noValidate
          onSubmit={form.handleSubmit(setPendingProfile)}
        >
          <div className="flex flex-col gap-24">
            <ProfileFields />
          </div>
          <StepSubmitButton disabled={saveMutation.isPending} />
        </form>
      </FormProvider>

      <Dialog
        open={pendingProfile !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingProfile(null);
          }
        }}
        header={`${jobFamilyName} 공고로 지원을 시작할까요?`}
        body={
          <>
            프로필을 등록하면 이 이메일로는 다른 공고에 지원할 수 없어요.
            <br />
            지원하려는 공고가 맞는지 확인해주세요.
          </>
        }
        primaryAction={{ children: "등록하기", onClick: handleConfirm }}
        secondaryAction={{ children: "취소", onClick: () => setPendingProfile(null) }}
      />
    </ApplyStepLayout>
  );
}
