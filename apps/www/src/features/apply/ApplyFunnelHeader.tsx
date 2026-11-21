"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { LocalNavigation } from "@jects/jds";

import { routeTo } from "@/constants/routes";
import { confirmLeave } from "@/hooks/apply/useLeaveConfirm";

interface ApplyFunnelHeaderProps {
  recruitId: number;
  navigationTitle: string;
  onBack?: () => void;
  children?: ReactNode;
}

export function ApplyFunnelHeader({
  recruitId,
  navigationTitle,
  onBack,
  children,
}: ApplyFunnelHeaderProps) {
  const router = useRouter();

  const handleBackClick = async () => {
    if (onBack) {
      onBack();
      return;
    }

    if (await confirmLeave()) {
      router.push(routeTo.applyGuide(recruitId));
    }
  };

  return (
    <div className="flex flex-col gap-24">
      <LocalNavigation
        title={navigationTitle}
        nested
        onBackClick={() => void handleBackClick()}
        stretched
      />
      {children}
    </div>
  );
}
