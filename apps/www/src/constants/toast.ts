import type { ToastBaseProps, ToastHandler } from "@jects/jds";

import { RESEND_COOLDOWN_SECONDS } from "@/constants/auth";

export interface ToastContent extends Pick<ToastBaseProps, "title" | "description"> {
  variant: keyof ToastHandler;
}

const RETRY_DESCRIPTION = "일시적 오류일 수 있으니 다시 시도해주세요.";

export const TOAST_CONTENT = {
  urlCopied: {
    variant: "basic",
    title: "URL을 클립보드에 복사했습니다.",
  },
  copyUrlFailed: {
    variant: "destructive",
    title: "URL 복사에 실패했습니다.",
  },
  authCodeSent: {
    variant: "basic",
    title: "인증번호 발송됨",
    description: `재발송 요청은 ${RESEND_COOLDOWN_SECONDS / 60}분 뒤에 가능합니다.`,
  },
  sendAuthCodeFailed: {
    variant: "destructive",
    title: "인증번호 발송 실패",
    description: RETRY_DESCRIPTION,
  },
  sendAuthCodeLimited: {
    variant: "destructive",
    title: "인증번호 발송 제한",
    description: "잠시 후 다시 시도해주세요.",
  },
  verifyAuthCodeFailed: {
    variant: "destructive",
    title: "인증 시도 실패",
    description: RETRY_DESCRIPTION,
  },
  setPinFailed: {
    variant: "destructive",
    title: "PIN 설정 실패",
    description: RETRY_DESCRIPTION,
  },
  identityVerified: {
    variant: "positive",
    title: "본인 확인 완료",
    description: "이제 지원서를 이어서 작성할 수 있어요.",
  },
  verifyIdentityFailed: {
    variant: "destructive",
    title: "본인 확인 실패",
    description: RETRY_DESCRIPTION,
  },
  checkApplyStatusFailed: {
    variant: "destructive",
    title: "지원 상태 확인 실패",
    description: RETRY_DESCRIPTION,
  },
  resetPinCompleted: {
    variant: "positive",
    title: "PIN 재설정 완료",
    description: "새로운 PIN을 입력해 본인 확인을 다시 진행해주세요.",
  },
  resetPinFailed: {
    variant: "destructive",
    title: "PIN 재설정 실패",
    description: RETRY_DESCRIPTION,
  },
  saveProfileFailed: {
    variant: "destructive",
    title: "프로필 저장 실패",
    description: RETRY_DESCRIPTION,
  },
  tempSaved: {
    variant: "positive",
    title: "임시 저장 완료",
    description: "작성 중인 지원서를 저장했어요.",
  },
  saveTempFailed: {
    variant: "destructive",
    title: "임시 저장 실패",
    description: "일시적 오류일 수 있으니 데이터 백업 후 다시 시도해주세요.",
  },
  submitApplicationFailed: {
    variant: "destructive",
    title: "지원서 제출 실패",
    description: "일시적 오류일 수 있으니 임시 저장 후 다시 시도해주세요.",
  },
  uploadFileFailed: {
    variant: "destructive",
    title: "파일 업로드 실패",
    description: RETRY_DESCRIPTION,
  },
  fileSizeExceeded: (maxFileSizeMb: number) => ({
    variant: "destructive",
    title: "파일 최대 용량 초과",
    description: `${maxFileSizeMb}MB 이하의 파일만 첨부할 수 있어요.`,
  }),
  invalidFileType: {
    variant: "destructive",
    title: "파일 형식 오류",
    description: "PDF 파일만 첨부할 수 있어요.",
  },
} satisfies Record<string, ToastContent | ((...args: never[]) => ToastContent)>;
