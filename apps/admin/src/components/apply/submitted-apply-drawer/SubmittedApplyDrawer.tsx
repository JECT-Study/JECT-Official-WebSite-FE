import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenu, IconButton, LabelButton } from "@jects/jds";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { applyQueries } from "@/apis/apply/queries";
import { Drawer } from "@/components/common/drawer/Drawer";

import { AnswerFields } from "./AnswerFields";
import { BasicInfoFields } from "./BasicInfoFields";
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
      headerAction={
        <div className="flex items-center gap-16 max-tablet:hidden">
          <LabelButton hierarchy="tertiary" size="md">
            편집
          </LabelButton>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton hierarchy="tertiary" size="lg" icon="ellipsis" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" sideOffset={12} className="w-[160px]">
              <DropdownMenu.Group>
                <DropdownMenu.Button prefixIcon="clock-3" prefixIconVisible>
                  변경 이력
                </DropdownMenu.Button>
                {/* JDS 메뉴 항목에 색 옵션이 없어 아이콘과 라벨에 직접 지정한다. */}
                <DropdownMenu.Button
                  prefixIcon="trash"
                  prefixIconVisible
                  className="*:text-feedback-destructive-neutral"
                >
                  삭제
                </DropdownMenu.Button>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      }
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
