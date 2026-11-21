"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { toastController } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyApi, type ApplyProfileRequest } from "@/apis/apply/api";
import type { JobFamily } from "@/apis/recruit/schemas";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { routeTo } from "@/constants/routes";
import { isRecruitClosedError } from "@/errors/isRecruitClosedError";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { StepSubmitButton } from "@/features/apply/StepSubmitButton";
import { showDialog } from "@/stores/dialogStore";

import { InterestedDomainsField } from "./InterestedDomainsField";
import { NameField } from "./NameField";
import { CAREER_DETAILS_OPTIONS, EXPERIENCE_PERIOD_OPTIONS, REGION_OPTIONS } from "./options";
import { PhoneNumberField } from "./PhoneNumberField";
import { ProfileSelectField } from "./ProfileSelectField";
import { profileFormSchema, type ProfileFormValues } from "./schemas";

interface ProfileStepProps {
  recruitId: number;
  jobFamily: JobFamily;
  jobFamilyName: string;
  onNext: () => void;
}

export function ProfileStep({ recruitId, jobFamily, jobFamilyName, onNext }: ProfileStepProps) {
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onTouched",
    defaultValues: { name: "", phoneNumber: "", interestedDomains: [] },
  });

  const saveMutation = useMutation({
    mutationFn: (request: ApplyProfileRequest) => applyApi.saveProfile(recruitId, request),
  });

  const moveToGuide = () => router.replace(routeTo.applyGuide(recruitId));

  const saveProfile = (profile: ProfileFormValues) => {
    saveMutation.mutate(
      { ...profile, jobFamily },
      {
        onSuccess: onNext,
        onError: (error) => {
          if (isRecruitClosedError(error)) {
            void showDialog(DIALOG_CONTENT.recruitClosed).then((action) => {
              if (action === "primary") {
                moveToGuide();
              }
            });
            return;
          }

          toastController.destructive("프로필 저장 실패", {
            description: "일시적 오류일 수 있으니 다시 시도해주세요.",
          });
        },
      }
    );
  };

  const handleSubmit = async (profile: ProfileFormValues) => {
    if ((await showDialog(DIALOG_CONTENT.startApply(jobFamilyName))) === "primary") {
      saveProfile(profile);
    }
  };

  return (
    <ApplyStepLayout title="프로필 작성">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-margin-3xl"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col gap-24">
            <NameField />
            <PhoneNumberField />
            <ProfileSelectField
              name="careerDetails"
              label="지원자 신분"
              placeholder="현재 신분을 선택해주세요"
              options={CAREER_DETAILS_OPTIONS}
            />
            <ProfileSelectField
              name="region"
              label="거주 지역"
              placeholder="현재 거주하는 지역을 선택해주세요"
              options={REGION_OPTIONS}
            />
            <ProfileSelectField
              name="experiencePeriod"
              label="직무 관련 경험 기간"
              labelTooltip="학습과 경력을 모두 포함한 기간"
              placeholder="직무 관련 경험 기간을 선택해주세요"
              options={EXPERIENCE_PERIOD_OPTIONS}
            />
            <InterestedDomainsField />
          </div>
          <StepSubmitButton disabled={saveMutation.isPending} />
        </form>
      </FormProvider>
    </ApplyStepLayout>
  );
}
