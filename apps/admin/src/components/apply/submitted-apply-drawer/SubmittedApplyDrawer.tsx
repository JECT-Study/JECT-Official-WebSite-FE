import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmptyState } from "@jects/jds";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyQueries } from "@/apis/apply/queries";
import { Drawer } from "@/components/common/drawer/Drawer";
import { DIALOG_CONTENT } from "@/constants/dialog";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { useDeleteApplyMutation } from "@/hooks/apply/useDeleteApplyMutation";
import { useEditApplyMutation } from "@/hooks/apply/useEditApplyMutation";
import { showDialog } from "@/stores/dialogStore";

import { AnswerFields } from "./AnswerFields";
import { BasicInfoFields } from "./BasicInfoFields";
import { EditingActions, ViewingActions } from "./HeaderActions";
import {
  submittedApplyFormSchema,
  type SubmittedApplyFormValues,
  toEditApplyRequest,
  toFormValues,
} from "./schemas";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  if (hasErrorCode(error, "APPLY-1")) {
    return (
      <EmptyState header="이미 삭제된 지원서입니다" body="목록에서 다른 지원서를 선택해주세요." />
    );
  }
  return (
    <EmptyState
      header="지원서를 불러오지 못했습니다"
      body="잠시 후 다시 시도해주세요."
      primaryAction={{ children: "다시 시도", onClick: onRetry }}
    />
  );
}

interface SubmittedApplyDrawerProps {
  applyId: number | null;
  open: boolean;
  onClose: () => void;
}

export default function SubmittedApplyDrawer({
  applyId,
  open,
  onClose,
}: SubmittedApplyDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data, error, refetch } = useQuery({ ...applyQueries.detail(applyId), enabled: open });
  const form = useForm<SubmittedApplyFormValues>({
    resolver: zodResolver(submittedApplyFormSchema),
    values: data && toFormValues(data),
    // 편집 중 재조회되어도 사용자가 수정한 값은 덮어쓰지 않는다.
    // form.reset()에도 적용되므로 편집을 끝낼 때는 끄고 호출한다.
    resetOptions: { keepDirtyValues: true },
  });
  const { mutateAsync: editApply } = useEditApplyMutation();
  const { mutateAsync: deleteApply } = useDeleteApplyMutation();
  const { isDirty } = form.formState;
  // 확인 후 편집 모드가 끝나면 다이얼로그를 연 버튼이 사라지므로 편집 버튼으로 포커스를 돌려준다.
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const cancelEditing = () => {
    form.reset(undefined, { keepDirtyValues: false });
    setIsEditing(false);
  };

  const openSaveDialog = (values: SubmittedApplyFormValues) => {
    if (applyId === null) return;
    void showDialog(DIALOG_CONTENT.saveApply, {
      onPrimaryClick: () =>
        editApply(
          { applyId, body: toEditApplyRequest(values) },
          {
            onSuccess: () => {
              form.reset(values, { keepDirtyValues: false });
              setIsEditing(false);
              onClose();
            },
          }
        ),
      fallbackFocusRef: editButtonRef,
    });
  };

  const openDeleteDialog = () => {
    if (applyId === null) return;
    void showDialog(DIALOG_CONTENT.deleteApply, {
      onPrimaryClick: () => deleteApply(applyId, { onSuccess: onClose }),
      fallbackFocusRef: editButtonRef,
    });
  };

  const confirmCancel = (onDiscard: () => void) => {
    if (!isDirty) return onDiscard();
    void showDialog(DIALOG_CONTENT.discardApplyChanges, {
      onSecondaryClick: onDiscard,
      fallbackFocusRef: editButtonRef,
    });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (open) return;
        confirmCancel(() => {
          cancelEditing();
          onClose();
        });
      }}
      title="지원서 정보"
      headerAction={
        isEditing ? (
          <EditingActions
            onCancel={() => confirmCancel(cancelEditing)}
            onSave={() => void form.handleSubmit(openSaveDialog)()}
          />
        ) : (
          <ViewingActions
            disabled={!data}
            editButtonRef={editButtonRef}
            onEdit={() => setIsEditing(true)}
            onDelete={openDeleteDialog}
          />
        )
      }
    >
      {/* 재조회만 실패했다면 이전 데이터를 계속 보여 준다. */}
      {error && !data ? (
        <div className="px-margin-lg pt-24 tablet:pt-32">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      ) : (
        <FormProvider {...form}>
          <form>
            <BasicInfoFields isEditing={isEditing} waitlistNumber={data?.waitlistNumber} />
            {data && (
              <AnswerFields
                isEditing={isEditing}
                answers={data.answers}
                portfolios={data.portfolios}
              />
            )}
          </form>
        </FormProvider>
      )}
    </Drawer>
  );
}
