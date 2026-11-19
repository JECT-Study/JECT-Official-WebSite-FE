"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { LocalNavigation } from "@jects/jds";

import { routeTo } from "@/constants/routes";

interface ApplyFunnelHeaderProps {
  recruitId: number;
  navigationTitle: string;
  children?: ReactNode;
}

export function ApplyFunnelHeader({
  recruitId,
  navigationTitle,
  children,
}: ApplyFunnelHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-24">
      <LocalNavigation
        title={navigationTitle}
        nested
        onBackClick={() => router.push(routeTo.applyGuide(recruitId))}
        stretched
      />
      {children}
    </div>
  );
}
