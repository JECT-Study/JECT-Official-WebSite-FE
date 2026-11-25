import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyQueries } from "@/apis/apply/queries";
import { Drawer } from "@/components/common/drawer/Drawer";

import { AnswerFields } from "./AnswerFields";
import { BasicInfoFields } from "./BasicInfoFields";
import { ViewingActions } from "./HeaderActions";
import { submittedApplyFormSchema, type SubmittedApplyFormValues, toFormValues } from "./schemas";

interface SubmittedApplyDrawerProps {
  applyId: number | null;
  onClose: () => void;
}

export default function SubmittedApplyDrawer({ applyId, onClose }: SubmittedApplyDrawerProps) {
  const { data } = useQuery(applyQueries.detail(applyId));
  const form = useForm<SubmittedApplyFormValues>({
    resolver: zodResolver(submittedApplyFormSchema),
    values: data && toFormValues(data),
    // 편집 중 재조회되어도 사용자가 수정한 값은 덮어쓰지 않는다.
    resetOptions: { keepDirtyValues: true },
  });

  return (
    <Drawer
      open={applyId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="지원서 정보"
      headerAction={<ViewingActions />}
    >
      <FormProvider {...form}>
        <form>
          <BasicInfoFields waitlistNumber={data?.waitlistNumber} />
          {data && <AnswerFields answers={data.answers} portfolios={data.portfolios} />}
        </form>
      </FormProvider>
    </Drawer>
  );
}
