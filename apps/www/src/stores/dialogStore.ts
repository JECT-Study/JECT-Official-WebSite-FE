import { create } from "zustand";
import { combine } from "zustand/middleware";

import type { DialogContent } from "@/constants/dialog";

const DIALOG_CLOSE_DELAY_MS = 200;

export type DialogAction = "primary" | "secondary";

interface DialogState {
  open: boolean;
  options: DialogContent | null;
  resolve: ((action: DialogAction | null) => void) | null;
  clearTimer: ReturnType<typeof setTimeout> | null;
}

const initialState: DialogState = {
  open: false,
  options: null,
  resolve: null,
  clearTimer: null,
};

export const useDialogStore = create(
  combine(initialState, (set, get) => {
    const settle = (action: DialogAction | null) => {
      const { resolve, clearTimer } = get();
      resolve?.(action);
      if (clearTimer) clearTimeout(clearTimer);

      const timer = setTimeout(() => {
        if (!get().open) {
          set({ options: null, resolve: null, clearTimer: null });
        }
      }, DIALOG_CLOSE_DELAY_MS);

      set({ open: false, resolve: null, clearTimer: timer });
    };

    return {
      show: (options: DialogContent) =>
        new Promise<DialogAction | null>((resolve) => {
          const { clearTimer, resolve: prevResolve } = get();
          if (clearTimer) clearTimeout(clearTimer);
          prevResolve?.(null);
          set({ open: true, options, resolve, clearTimer: null });
        }),
      selectAction: (action: DialogAction) => settle(action),
      dismiss: () => settle(null),
    };
  })
);

/**
 * 다이얼로그를 열고, 닫힐 때 사용자가 누른 버튼(`"primary"`, `"secondary"`)으로 resolve되는 Promise를 반환한다.
 * 버튼을 누르지 않고 닫히면 `null`로 resolve된다. 바깥 영역 클릭, Esc 키 입력, 다른 다이얼로그 열기, `dismissDialog` 호출이 해당한다.
 */
export const showDialog = (options: DialogContent) => useDialogStore.getState().show(options);

/**
 * 열린 다이얼로그를 닫는다. 대기 중인 `showDialog`의 Promise는 `null`로 resolve된다.
 */
export const dismissDialog = () => useDialogStore.getState().dismiss();
