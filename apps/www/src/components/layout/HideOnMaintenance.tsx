"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";

// 점검 중에는 다른 페이지로 이동할 수 없으므로 GNB와 푸터를 렌더링하지 않는다.
export function HideOnMaintenance({ children }: { children: ReactNode }) {
  return usePathname() === ROUTES.maintenance ? null : children;
}
