import { useRef } from "react";

/**
 * Radix Dialog는 닫을 때 `Dialog.Trigger`로 포커스를 되돌린다.
 * 트리거 없이 열림 상태를 제어하는 경우 이 훅의 반환값을 `Dialog.Content`에 전달한다.
 */
export function useDialogOpenerFocus() {
  const openerRef = useRef<HTMLElement | null>(null);

  return {
    onOpenAutoFocus: () => {
      openerRef.current = document.activeElement as HTMLElement | null;
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault();
      openerRef.current?.focus();
    },
  };
}
