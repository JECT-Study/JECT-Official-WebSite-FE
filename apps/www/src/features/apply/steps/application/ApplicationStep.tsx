"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { BlockButton, Dialog, toastController } from "@jects/jds";
import { useIsMutating } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyMutationKeys } from "@/apis/apply/queryKeys";
import { JECT_EMAIL } from "@/constants/links";
import { routeTo } from "@/constants/routes";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { isRecruitClosedError } from "@/errors/isRecruitClosedError";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { RecruitClosedDialog } from "@/features/apply/RecruitClosedDialog";
import { useApplicationSuspenseQueries } from "@/hooks/apply/useApplicationSuspenseQueries";
import { useSaveTempApplicationMutation } from "@/hooks/apply/useSaveTempApplicationMutation";
import { useSubmitApplicationMutation } from "@/hooks/apply/useSubmitApplicationMutation";

import { ApplicationFields } from "./ApplicationFields";
import {
  type ApplicationFormValues,
  createApplicationSchema,
  createDefaultValues,
  toApplicationRequest,
} from "./schemas";

interface ApplicationStepProps {
  recruitId: number;
  onNext: () => void;
}

export function ApplicationStep({ recruitId, onNext }: ApplicationStepProps) {
  const router = useRouter();
  const { questions, tempApplication } = useApplicationSuspenseQueries(recruitId);

  const [pendingApplication, setPendingApplication] = useState<ApplicationFormValues | null>(null);
  const [isClosedDialogOpen, setIsClosedDialogOpen] = useState(false);
  const [isSubmittedDialogOpen, setIsSubmittedDialogOpen] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema(questions)),
    mode: "onTouched",
    defaultValues: createDefaultValues(questions, tempApplication),
  });
  const { isValid } = form.formState;

  const saveTempMutation = useSaveTempApplicationMutation();
  const submitMutation = useSubmitApplicationMutation();
  const isUploading = useIsMutating({ mutationKey: applyMutationKeys.uploadPortfolio }) > 0;
  const isPending = saveTempMutation.isPending || submitMutation.isPending || isUploading;

  const moveToGuide = () => router.replace(routeTo.applyGuide(recruitId));

  const handleSaveTemp = () => {
    saveTempMutation.mutate(
      { recruitId, request: toApplicationRequest(form.getValues()) },
      {
        onSuccess: () => {
          toastController.positive("임시 저장 완료", {
            description: "작성 중인 지원서를 저장했어요.",
          });
        },
        onError: (error) => {
          if (isRecruitClosedError(error)) {
            setIsClosedDialogOpen(true);
            return;
          }

          toastController.destructive("임시 저장 실패", {
            description: "일시적 오류일 수 있으니 데이터 백업 후 다시 시도해주세요.",
          });
        },
      }
    );
  };

  const handleConfirmSubmit = () => {
    if (pendingApplication === null) {
      return;
    }

    submitMutation.mutate(
      { recruitId, request: toApplicationRequest(pendingApplication) },
      {
        onSuccess: onNext,
        onError: (error) => {
          if (hasErrorCode(error, "APPLY-2")) {
            setIsSubmittedDialogOpen(true);
            return;
          }

          if (isRecruitClosedError(error)) {
            setIsClosedDialogOpen(true);
            return;
          }

          toastController.destructive("지원서 제출 실패", {
            description: `일시적 오류일 수 있으니 임시 저장 후 다시 시도해주세요.`,
          });
        },
      }
    );
    setPendingApplication(null);
  };

  return (
    <ApplyStepLayout title="지원서 작성">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-margin-3xl"
          noValidate
          onSubmit={form.handleSubmit(setPendingApplication)}
        >
          <div className="flex flex-col gap-24">
            <ApplicationFields questions={questions} />
          </div>
          <div className="flex gap-12">
            <BlockButton
              type="button"
              hierarchy="secondary"
              variant="outlined"
              size="md"
              disabled={isPending}
              onClick={handleSaveTemp}
            >
              임시 저장하기
            </BlockButton>
            <BlockButton
              type="submit"
              hierarchy="accent"
              size="md"
              disabled={isPending || !isValid}
            >
              지원서 제출하기
            </BlockButton>
          </div>
        </form>
      </FormProvider>

      <Dialog
        open={pendingApplication !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingApplication(null);
          }
        }}
        header="지원서를 최종 제출합니다"
        body={
          <>
            제출한 뒤에는 지원서를 수정하거나 지원을 취소할 수 없어요.
            <br />
            지원 관련 도움이 필요하시다면 {JECT_EMAIL} 로 문의해주세요.
          </>
        }
        primaryAction={{ children: "지원서 제출하기", onClick: handleConfirmSubmit }}
        secondaryAction={{ children: "취소", onClick: () => setPendingApplication(null) }}
      />

      <RecruitClosedDialog open={isClosedDialogOpen} recruitId={recruitId} />
      <Dialog
        open={isSubmittedDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            moveToGuide();
          }
        }}
        header="이미 제출한 지원서예요"
        body={
          <>
            이미 제출이 완료되어 지원서를 다시 제출할 수 없어요.
            <br />
            공고 페이지로 이동합니다.
          </>
        }
        primaryAction={{ children: "확인", onClick: moveToGuide }}
      />
    </ApplyStepLayout>
  );
}
