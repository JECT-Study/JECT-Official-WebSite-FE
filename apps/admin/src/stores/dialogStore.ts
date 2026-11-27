import type { RefObject } from "react";

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
  /** 다이얼로그를 연 요소가 사라지거나 비활성화되어 포커스를 돌려줄 수 없을 때 대신 포커스한다. */
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

interface DialogState {
  open: boolean;
  pending: boolean;
  content: DialogContent | null;
  options: DialogOptions;
  resolve: ((action: DialogAction | null) => void) | null;
  opener: HTMLElement | null;
}

const initialState: DialogState = {
  open: false,
  pending: false,
  content: null,
  options: {},
  resolve: null,
  opener: null,
};

let clearTimer: ReturnType<typeof setTimeout> | null = null;

const cancelClear = () => {
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = null;
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as { then?: unknown } | null | undefined)?.then === "function";

// JDS Dialog는 트리거 없이 열면 닫힐 때 포커스를 돌려주지 않아 직접 복원한다.
const restoreFocus = (
  opener: HTMLElement | null,
  fallbackFocusRef?: RefObject<HTMLElement | null>
) => {
  opener?.focus({ preventScroll: true });
  if (document.activeElement !== opener) fallbackFocusRef?.current?.focus({ preventScroll: true });
};

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
          restoreFocus(get().opener, get().options.fallbackFocusRef);
          set({ content: null, options: {}, opener: null });
        }
      }, DIALOG_CLOSE_DELAY_MS);
    };

    return {
      show: (content: DialogContent, options: DialogOptions = {}) =>
        new Promise<DialogAction | null>((resolve) => {
          cancelClear();
          get().resolve?.(null);
          const opener =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
          set({ open: true, pending: false, content, options, resolve, opener });
        }),
      selectAction: async (action: DialogAction) => {
        const { pending, options, resolve } = get();
        const handler = action === "primary" ? options.onPrimaryClick : options.onSecondaryClick;
        // 핸들러가 없는 버튼은 다른 버튼의 요청 중에도 눌러서 닫을 수 있다.
        if (!resolve || (pending && handler)) return;

        try {
          const result = handler?.();
          if (isPromiseLike(result)) {
            if (get().resolve === resolve) set({ pending: true });
            await result;
          }
        } catch {
          // 실패 안내는 핸들러가 담당하고, 다시 시도할 수 있도록 열어 둔다.
          if (get().resolve === resolve) set({ pending: false });
          return;
        }

        // 기다리는 동안 교체되거나 닫혔으면 새 다이얼로그를 건드리지 않는다.
        if (get().resolve === resolve) settle(action);
      },
      dismiss: () => settle(null),
    };
  })
);

/**
 * 다이얼로그를 열고, 닫힐 때 사용자가 누른 버튼(`"primary"`, `"secondary"`)으로 resolve되는 Promise를 반환한다.
 * 버튼 핸들러가 Promise를 반환하면 끝날 때까지 그 버튼을 비활성화하고, 성공하면 닫는다.
 * 핸들러가 실패하면 열린 채로 두므로 실패한 버튼으로는 resolve되지 않는다.
 * 기다리는 동안 닫혀도 핸들러는 계속 진행된다.
 * 버튼을 누르지 않고 닫히면 `null`로 resolve된다. 바깥 영역 클릭, Esc 키 입력, 다른 다이얼로그 열기, `dismissDialog` 호출이 해당한다.
 */
export const showDialog = (content: DialogContent, options?: DialogOptions) =>
  useDialogStore.getState().show(content, options);

/**
 * 진행 중인 핸들러가 있어도 다이얼로그를 닫는다. 대기 중인 `showDialog`의 Promise는 `null`로 resolve된다.
 */
export const dismissDialog = () => useDialogStore.getState().dismiss();
