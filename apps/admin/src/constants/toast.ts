import type { ToastBaseProps, ToastHandler } from "@jects/jds";

export interface ToastContent extends Pick<ToastBaseProps, "title" | "description"> {
  variant: keyof ToastHandler;
}

const RETRY_DESCRIPTION = "잠시 후 다시 시도해주세요.";

export const TOAST_CONTENT = {
  loginInvalidCredentials: {
    variant: "destructive",
    title: "로그인할 수 없어요",
    description: "이메일 또는 비밀번호를 확인해주세요.",
  },
  loginAccountDeactivated: {
    variant: "destructive",
    title: "계정이 비활성화됐어요",
    description: "관리자에게 문의해주세요.",
  },
  loginAttemptsExceeded: {
    variant: "destructive",
    title: "로그인 시도를 초과했어요",
    description: RETRY_DESCRIPTION,
  },
  loginFailed: {
    variant: "destructive",
    title: "로그인에 실패했어요",
    description: RETRY_DESCRIPTION,
  },
  logoutFailed: {
    variant: "destructive",
    title: "로그아웃에 실패했어요",
    description: RETRY_DESCRIPTION,
  },
  accountsDeactivated: {
    variant: "positive",
    title: "계정을 비활성화했어요",
  },
  deactivateForbidden: {
    variant: "destructive",
    title: "해당 기능을 수행할 권한이 없어요",
  },
  deactivateSelfNotAllowed: {
    variant: "destructive",
    title: "본인 계정은 비활성화할 수 없어요",
  },
  deactivateFailed: {
    variant: "destructive",
    title: "비활성화에 실패했어요",
  },
  loadSubmittedAppliesFailed: {
    variant: "destructive",
    title: "지원서 목록을 불러오지 못했어요",
    description: RETRY_DESCRIPTION,
  },
  appliesDeleted: (count: number) => ({
    variant: "positive",
    title: `${count}개를 삭제했어요`,
  }),
  appliesAlreadyDeleted: {
    variant: "basic",
    title: "이미 삭제된 지원서예요",
  },
  deleteConfirmedAppliesNotAllowed: {
    variant: "destructive",
    title: "검토가 확정된 공고의 지원서는 삭제할 수 없어요",
  },
  deleteAppliesFailed: {
    variant: "destructive",
    title: "지원서를 삭제하지 못했어요",
    description: RETRY_DESCRIPTION,
  },
  selectionResultsUpdated: (count: number, label: string) => ({
    variant: "positive",
    title: `${count}개를 ${label} 상태로 변경했어요`,
  }),
  updateIncludesDeletedApplies: {
    variant: "destructive",
    title: "이미 삭제된 지원서가 포함되어 있어요",
    description: "새로고침 후 다시 시도해주세요.",
  },
  updateConfirmedAppliesNotAllowed: {
    variant: "destructive",
    title: "검토가 확정된 공고의 지원서는 변경할 수 없어요",
  },
  updateSelectionResultsFailed: (label: string) => ({
    variant: "destructive",
    title: `${label} 상태로 변경하지 못했어요`,
    description: RETRY_DESCRIPTION,
  }),
  applyEdited: {
    variant: "positive",
    title: "변경사항을 저장했어요",
  },
  editApplyFailed: {
    variant: "destructive",
    title: "지원서를 저장하지 못했어요",
    description: RETRY_DESCRIPTION,
  },
  applyDeleted: {
    variant: "positive",
    title: "지원서를 삭제했어요",
  },
  applyAlreadyDeleted: {
    variant: "destructive",
    title: "이미 삭제된 지원서예요",
  },
  downloadFileFailed: {
    variant: "destructive",
    title: "파일을 다운로드하지 못했어요",
    description: RETRY_DESCRIPTION,
  },
} satisfies Record<string, ToastContent | ((...args: never[]) => ToastContent)>;
