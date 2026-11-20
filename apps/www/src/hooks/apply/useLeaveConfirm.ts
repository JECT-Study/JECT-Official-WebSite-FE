import { useEffect } from "react";

import { DIALOG_CONTENT } from "@/constants/dialog";
import { showDialog } from "@/stores/dialogStore";

let isEnabled = false;

export function isLeaveConfirmEnabled() {
  return isEnabled;
}

/** `useLeaveConfirm`이 활성화된 동안에는 이탈 확인 다이얼로그를 띄우고 이동 여부를 반환한다. */
export async function confirmLeave() {
  if (!isEnabled) {
    return true;
  }

  return (await showDialog(DIALOG_CONTENT.leaveApplication)) === "primary";
}

/** `enabled`인 동안 새로고침, 탭 닫기 전에 브라우저 확인창을 띄우고 `confirmLeave`를 활성화한다. */
export function useLeaveConfirm(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    isEnabled = true;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isEnabled = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
