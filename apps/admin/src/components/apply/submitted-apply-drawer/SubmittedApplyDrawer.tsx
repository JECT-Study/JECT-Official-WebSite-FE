import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyQueries } from "@/apis/apply/queries";
import { Drawer } from "@/components/common/drawer/Drawer";

import { AnswerFields } from "./AnswerFields";
import { BasicInfoFields } from "./BasicInfoFields";
import { EditingActions, ViewingActions } from "./HeaderActions";
import { submittedApplyFormSchema, type SubmittedApplyFormValues, toFormValues } from "./schemas";

interface SubmittedApplyDrawerProps {
  applyId: number | null;
  onClose: () => void;
}

export default function SubmittedApplyDrawer({ applyId, onClose }: SubmittedApplyDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useQuery(applyQueries.detail(applyId));
  const form = useForm<SubmittedApplyFormValues>({
    resolver: zodResolver(submittedApplyFormSchema),
    values: data && toFormValues(data),
    // 편집 중 재조회되어도 사용자가 수정한 값은 덮어쓰지 않는다.
    resetOptions: { keepDirtyValues: true },
  });

  const cancelEditing = () => {
    form.reset();
    setIsEditing(false);
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
          // TODO: 편집 취소와 저장하기는 확인 다이얼로그를 거쳐 실행한다.
          <EditingActions onCancel={cancelEditing} />
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
    </Drawer>
  );
}
