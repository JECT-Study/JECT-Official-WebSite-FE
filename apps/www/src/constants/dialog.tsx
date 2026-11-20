import type { DialogProps } from "@jects/jds";

import { JECT_EMAIL } from "@/constants/links";

export interface DialogContent extends Pick<DialogProps, "header" | "body"> {
  primaryLabel: string;
  secondaryLabel?: string;
}

export const DIALOG_CONTENT = {
  recruitClosed: {
    header: "모집이 마감되었어요",
    body: (
      <>
        모집 기간이 종료되어 이 공고에는 지원할 수 없어요.
        <br />
        공고 페이지로 이동합니다.
      </>
    ),
    primaryLabel: "확인",
  },
  startApply: (jobFamilyName: string) => ({
    header: `${jobFamilyName} 공고로 지원을 시작할까요?`,
    body: (
      <>
        지원서를 임시 저장하거나 제출하면 이 이메일로는 모집 중인 다른 공고에 지원할 수 없어요.
        <br />
        지원하려는 공고가 맞는지 확인해주세요.
      </>
    ),
    primaryLabel: "등록하기",
    secondaryLabel: "취소",
  }),
  submitApplication: {
    header: "지원서를 최종 제출합니다",
    body: (
      <>
        제출한 뒤에는 지원서를 수정하거나 지원을 취소할 수 없어요.
        <br />
        지원 관련 도움이 필요하시다면 {JECT_EMAIL} 로 문의해주세요.
      </>
    ),
    primaryLabel: "지원서 제출하기",
    secondaryLabel: "취소",
  },
  alreadySubmitted: {
    header: "이미 제출한 지원서예요",
    body: (
      <>
        이미 제출이 완료되어 지원서를 다시 제출할 수 없어요.
        <br />
        공고 페이지로 이동합니다.
      </>
    ),
    primaryLabel: "확인",
  },
  existingApplicant: {
    header: "페이지를 이동해 지원서를 이어서 작성합니다",
    body: "이미 등록된 이메일은 마지막 작성 단계부터 이어서 작성할 수 있어요.",
    primaryLabel: "페이지 이동하기",
    secondaryLabel: "닫기",
  },
  submittedEmail: {
    header: "이미 지원서가 접수된 이메일입니다",
    body: (
      <>
        접수된 지원서는 수정하거나 취소할 수 없어요.
        <br />
        내용 수정, 지원 취소 등은 다음의 연락처로 문의 부탁드립니다.
        <br />
        문의: {JECT_EMAIL}
      </>
    ),
    primaryLabel: "확인",
  },
  applicationInProgress: {
    header: "다른 공고에 지원한 내역이 있어요",
    body: (
      <>
        다른 모집 공고에 작성 중이거나 제출한 지원서가 있어 이 공고에는 지원할 수 없어요.
        <br />
        지원 관련 도움이 필요하시다면 {JECT_EMAIL} 로 문의해주세요.
      </>
    ),
    primaryLabel: "확인",
  },
} satisfies Record<string, DialogContent | ((...args: never[]) => DialogContent)>;
