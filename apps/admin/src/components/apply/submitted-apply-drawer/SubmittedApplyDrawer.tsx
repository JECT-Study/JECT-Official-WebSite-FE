import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@jects/jds";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyQueries } from "@/apis/apply/queries";
import { Drawer } from "@/components/common/drawer/Drawer";
import { useEditApplyMutation } from "@/hooks/apply/useEditApplyMutation";

import { AnswerFields } from "./AnswerFields";
import { BasicInfoFields } from "./BasicInfoFields";
import { EditingActions, ViewingActions } from "./HeaderActions";
import {
  submittedApplyFormSchema,
  type SubmittedApplyFormValues,
  toEditApplyRequest,
  toFormValues,
} from "./schemas";

interface SubmittedApplyDrawerProps {
  applyId: number | null;
  onClose: () => void;
}

export default function SubmittedApplyDrawer({ applyId, onClose }: SubmittedApplyDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { data } = useQuery(applyQueries.detail(applyId));
  const form = useForm<SubmittedApplyFormValues>({
    resolver: zodResolver(submittedApplyFormSchema),
    values: data && toFormValues(data),
    // 편집 중 재조회되어도 사용자가 수정한 값은 덮어쓰지 않는다.
    resetOptions: { keepDirtyValues: true },
  });
  const { mutate: editApply, isPending: isSaving } = useEditApplyMutation();
  const isSavingRef = useRef(false);

  const cancelEditing = () => {
    form.reset();
    setIsEditing(false);
  };

  const saveApply = () => {
    // isPending은 다음 렌더에 반영되어 연속 클릭을 막지 못하므로 ref로 즉시 잠근다.
    if (isSavingRef.current || applyId === null) return;
    isSavingRef.current = true;
    const values = form.getValues();
    editApply(
      { applyId, body: toEditApplyRequest(values) },
      {
        onSuccess: () => {
          form.reset(values);
          setIsEditing(false);
          setIsSaveDialogOpen(false);
        },
        onSettled: () => {
          isSavingRef.current = false;
        },
      }
    );
  };

  return (
    <Drawer
      open={applyId !== null}
      onOpenChange={(open) => {
        if (open) return;
        cancelEditing();
        onClose();
      }}
      title="지원서 정보"
      headerAction={
        isEditing ? (
          // TODO: 편집 취소는 확인 다이얼로그를 거쳐 실행한다.
          <EditingActions
            onCancel={cancelEditing}
            onSave={form.handleSubmit(() => setIsSaveDialogOpen(true))}
          />
        ) : (
          <ViewingActions disabled={!data} onEdit={() => setIsEditing(true)} />
        )
      }
    >
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
      <Dialog
        open={isSaveDialogOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsSaveDialogOpen(open);
        }}
        header="변경사항을 저장합니다."
        body="저장하면 수정한 내용이 반영돼요."
        width={500}
        primaryAction={{ children: "저장", onClick: saveApply, disabled: isSaving }}
        secondaryAction={{
          children: "취소",
          onClick: () => setIsSaveDialogOpen(false),
          disabled: isSaving,
        }}
      />
    </Drawer>
  );
}
