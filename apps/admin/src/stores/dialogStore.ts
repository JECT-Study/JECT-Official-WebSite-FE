import type { DialogProps } from "@jects/jds";
import { create } from "zustand";
import { combine } from "zustand/middleware";

import type { DialogContent } from "@/constants/dialog";

const DIALOG_CLOSE_DELAY_MS = 200;

export type DialogAction = "primary" | "secondary";

type DialogHandler = () => void | PromiseLike<unknown>;

export interface DialogOptions extends Pick<DialogProps, "closeOnInteractOutside"> {
  onPrimaryClick?: DialogHandler;
  onSecondaryClick?: DialogHandler;
}

interface DialogState {
  open: boolean;
  pending: boolean;
  content: DialogContent | null;
  options: DialogOptions;
  resolve: ((action: DialogAction | null) => void) | null;
}

const initialState: DialogState = {
  open: false,
  pending: false,
  content: null,
  options: {},
  resolve: null,
};

let clearTimer: ReturnType<typeof setTimeout> | null = null;

const cancelClear = () => {
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = null;
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as { then?: unknown } | null | undefined)?.then === "function";

export const useDialogStore = create(
  combine(initialState, (set, get) => {
    const settle = (action: DialogAction | null) => {
      if (!get().open) return;

      get().resolve?.(action);
      set({ open: false, pending: false, resolve: null });

      cancelClear();
      clearTimer = setTimeout(() => {
        clearTimer = null;
        if (!get().open) {
          set({ content: null, options: {} });
        }
      }, DIALOG_CLOSE_DELAY_MS);
    };

    return {
      show: (content: DialogContent, options: DialogOptions = {}) =>
        new Promise<DialogAction | null>((resolve) => {
          cancelClear();
          get().resolve?.(null);
          set({ open: true, pending: false, content, options, resolve });
        }),
      selectAction: async (action: DialogAction) => {
        const { pending, options, resolve } = get();
        if (pending || !resolve) return;

        const handler = action === "primary" ? options.onPrimaryClick : options.onSecondaryClick;
        try {
          const result = handler?.();
          if (isPromiseLike(result)) {
            set({ pending: true });
            await result;
          }
        } catch {
          // 실패 안내는 핸들러가 담당하고, 다시 시도할 수 있도록 열어 둔다.
          if (get().resolve === resolve) set({ pending: false });
          return;
        }

        // 기다리는 동안 교체되거나 강제로 닫혔으면 새 다이얼로그를 건드리지 않는다.
        if (get().resolve === resolve) settle(action);
      },
      dismiss: () => settle(null),
    };
  })
);

/**
 * 다이얼로그를 열고, 닫힐 때 사용자가 누른 버튼(`"primary"`, `"secondary"`)으로 resolve되는 Promise를 반환한다.
 * 버튼 핸들러가 Promise를 반환하면 끝날 때까지 사용자가 닫지 못하게 하고, 성공하면 닫는다.
 * 핸들러가 실패하면 열린 채로 두므로 실패한 버튼으로는 resolve되지 않는다.
 * 버튼을 누르지 않고 닫히면 `null`로 resolve된다. 바깥 영역 클릭, Esc 키 입력, 다른 다이얼로그 열기, `dismissDialog` 호출이 해당한다.
 */
export const showDialog = (content: DialogContent, options?: DialogOptions) =>
  useDialogStore.getState().show(content, options);

/**
 * 진행 중인 핸들러가 있어도 다이얼로그를 닫는다. 대기 중인 `showDialog`의 Promise는 `null`로 resolve된다.
 */
export const dismissDialog = () => useDialogStore.getState().dismiss();
