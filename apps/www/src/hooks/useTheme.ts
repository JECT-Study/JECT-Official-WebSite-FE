"use client";

import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "@/constants/theme";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();

let appliedTheme: Theme | null = null;
let darkQuery: MediaQueryList | null = null;

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function readSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function applyTheme(next: Theme) {
  appliedTheme = next;
  document.documentElement.setAttribute("data-theme", next);
  listeners.forEach((listener) => listener());
}

/** 저장된 선택이 있으면 OS 설정보다 우선한다. */
function handleSystemChange() {
  if (readStoredTheme() !== null) return;

  applyTheme(readSystemTheme());
}

/** 다른 탭에서 테마를 바꿨을 때 호출된다. */
function handleStorageChange(event: StorageEvent) {
  if (event.key !== THEME_STORAGE_KEY) return;

  applyTheme(readStoredTheme() ?? readSystemTheme());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    darkQuery = window.matchMedia(DARK_QUERY);
    darkQuery.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      darkQuery?.removeEventListener("change", handleSystemChange);
      darkQuery = null;
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

function getSnapshot(): Theme {
  appliedTheme ??=
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

  return appliedTheme;
}

/** 서버에는 적용된 테마가 없으므로 라이트로 렌더한 뒤 하이드레이션에서 실제 값으로 맞춘다. */
function getServerSnapshot(): Theme {
  return "light";
}

function setTheme(next: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // 저장에 실패해도 이번 세션에는 적용한다.
  }

  applyTheme(next);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { theme, setTheme };
}
