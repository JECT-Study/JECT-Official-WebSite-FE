import type { DialogProps } from "@jects/jds";

export interface DialogContent extends Pick<DialogProps, "header" | "body" | "width"> {
  primaryLabel: string;
  secondaryLabel?: string;
}

export const DIALOG_CONTENT = {
  deactivateAccounts: (count: number) => ({
    header: `계정 ${count}개를 비활성화하시겠습니까?`,
    body: "비활성화한 계정은 백오피스에 로그인할 수 없습니다.",
    primaryLabel: "비활성화",
    secondaryLabel: "취소",
  }),
  updateSelectionResults: (count: number, label: string) => ({
    header: `선택한 ${count}개 항목을 ${label} 상태로 변경합니다`,
    body: `${label} 상태는 언제든 변경할 수 있어요.`,
    primaryLabel: "변경",
    secondaryLabel: "취소",
  }),
  deleteSubmittedApplies: (count: number) => ({
    header: `선택한 ${count}개 항목을 삭제합니다`,
    body: "삭제 후에는 되돌릴 수 없으니 유의해주세요.",
    primaryLabel: "삭제",
    secondaryLabel: "취소",
  }),
  saveApply: {
    header: "변경사항을 저장합니다",
    body: "저장하면 수정한 내용이 반영돼요.",
    primaryLabel: "저장",
    secondaryLabel: "취소",
  },
  discardApplyChanges: {
    header: "변경사항이 저장되지 않습니다",
    body: "저장하지 않은 수정 내용은 반영되지 않아요.",
    primaryLabel: "계속 편집",
    secondaryLabel: "편집 취소",
  },
  deleteApply: {
    header: "지원서를 삭제합니다",
    body: "삭제 후에는 되돌릴 수 없으니 유의해주세요.",
    primaryLabel: "삭제",
    secondaryLabel: "취소",
  },
} satisfies Record<string, DialogContent | ((...args: never[]) => DialogContent)>;
