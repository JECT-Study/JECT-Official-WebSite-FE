import { createContext, use } from "react";

/** 페이지의 액션을 Header에 포털로 렌더링할 위치를 제공한다. */
export const HeaderActionSlotContext = createContext<HTMLElement | null>(null);

export function useHeaderActionSlot() {
  return use(HeaderActionSlotContext);
}
