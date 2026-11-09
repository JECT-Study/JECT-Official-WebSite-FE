"use client";

import { useRouter } from "next/navigation";

import { Dialog } from "@jects/jds";

import { routeTo } from "@/constants/routes";

interface RecruitClosedDialogProps {
  open: boolean;
  recruitId: number;
}

export function RecruitClosedDialog({ open, recruitId }: RecruitClosedDialogProps) {
  const router = useRouter();

  const moveToGuide = () => router.replace(routeTo.applyGuide(recruitId));

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          moveToGuide();
        }
      }}
      header="모집이 마감되었어요"
      body={
        <>
          모집 기간이 종료되어 이 공고에는 지원할 수 없어요.
          <br />
          공고 페이지로 이동합니다.
        </>
      }
      primaryAction={{ children: "확인", onClick: moveToGuide }}
    />
  );
}
