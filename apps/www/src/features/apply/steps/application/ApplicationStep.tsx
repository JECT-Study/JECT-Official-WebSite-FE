"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { hasErrorCode } from "@ject/api-client";
import { BlockButton } from "@jects/jds";
import { useIsMutating, useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyApi, type SubmitApplicationRequest } from "@/apis/apply/api";
import { applyMutationKeys, applyQueries } from "@/apis/apply/queries";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { routeTo } from "@/constants/routes";
import { TOAST_CONTENT } from "@/constants/toast";
import { isRecruitClosedError } from "@/errors/isRecruitClosedError";
import { ApplyStepLayout } from "@/features/apply/ApplyStepLayout";
import { useLeaveConfirm } from "@/hooks/apply/useLeaveConfirm";
import { useSaveTempApplicationMutation } from "@/hooks/apply/useSaveTempApplicationMutation";
import { showDialog } from "@/stores/dialogStore";
import { showToast } from "@/utils/showToast";

import { ApplicationField } from "./ApplicationField";
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
  const { questions, tempApplication } = useSuspenseQueries({
    queries: [applyQueries.questions(recruitId), applyQueries.tempApplication(recruitId)],
    combine: ([questions, tempApplication]) => ({
      questions: questions.data.questionResponses,
      tempApplication: tempApplication.data,
    }),
  });

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema(questions)),
    mode: "onTouched",
    defaultValues: createDefaultValues(questions, tempApplication),
  });
  const { isValid, isDirty } = form.formState;
  useLeaveConfirm(isDirty);

  const saveTempMutation = useSaveTempApplicationMutation();
  const submitMutation = useMutation({
    mutationFn: (request: SubmitApplicationRequest) =>
      applyApi.submitApplication(recruitId, request),
  });
  const isUploading = useIsMutating({ mutationKey: applyMutationKeys.uploadPortfolio() }) > 0;
  const isPending = saveTempMutation.isPending || submitMutation.isPending || isUploading;

  const moveToGuide = () => router.replace(routeTo.applyGuide(recruitId));

  const handleSaveTemp = () => {
    const values = form.getValues();

    saveTempMutation.mutate(
      { recruitId, request: toApplicationRequest(values) },
      {
        onSuccess: () => {
          form.resetDefaultValues(values);
          showToast(TOAST_CONTENT.tempSaved);
        },
        onError: (error) => {
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

          if (hasErrorCode(error, "APPLY-12")) {
            void showDialog(DIALOG_CONTENT.applicationInProgress);
            return;
          }

          if (hasErrorCode(error, "APPLY-18")) {
            void showDialog(DIALOG_CONTENT.activeMember);
            return;
          }

          showToast(TOAST_CONTENT.saveTempFailed);
        },
      }
    );
  };

  const submitApplication = (application: ApplicationFormValues) => {
    submitMutation.mutate(toApplicationRequest(application), {
      onSuccess: onNext,
      onError: (error) => {
        if (hasErrorCode(error, "APPLY-2")) {
          void showDialog(DIALOG_CONTENT.alreadySubmitted, { closeOnInteractOutside: false }).then(
            (action) => {
              if (action === "primary") {
                moveToGuide();
              }
            }
          );
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

        if (hasErrorCode(error, "APPLY-12")) {
          void showDialog(DIALOG_CONTENT.applicationInProgress);
          return;
        }

        if (hasErrorCode(error, "APPLY-18")) {
          void showDialog(DIALOG_CONTENT.activeMember);
          return;
        }

        showToast(TOAST_CONTENT.submitApplicationFailed);
      },
    });
  };

  const handleSubmit = async (application: ApplicationFormValues) => {
    if ((await showDialog(DIALOG_CONTENT.submitApplication)) === "primary") {
      submitApplication(application);
    }
  };

  return (
    <ApplyStepLayout title="지원서 작성">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-margin-3xl"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col gap-24">
            {questions
              // 현재 선택형 질문을 사용하지 않으므로 렌더링하지 않는다.
              .filter((question) => question.inputType !== "SELECT")
              .map((question) => (
                <ApplicationField key={question.id} question={question} />
              ))}
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
    </ApplyStepLayout>
  );
}
