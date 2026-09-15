"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** 서버 렌더와 하이드레이션 시점에는 false를 반환한다. document에 접근하기 전에 확인한다. */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
