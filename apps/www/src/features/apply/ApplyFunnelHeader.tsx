"use client";

import { useRouter } from "next/navigation";

import { LocalNavigation, Steps } from "@jects/jds";

import { routeTo } from "@/constants/routes";

const STEP_LABELS = ["이메일 인증", "프로필 작성", "지원서 작성"];

interface ApplyFunnelHeaderProps {
  recruitId: number;
  recruitTitle: string;
  current: number;
}

export function ApplyFunnelHeader({ recruitId, recruitTitle, current }: ApplyFunnelHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-24">
      <LocalNavigation
        title={recruitTitle}
        nested
        onBackClick={() => router.push(routeTo.applyGuide(recruitId))}
        stretched
      />
      <Steps.Root size="md" current={current}>
        {STEP_LABELS.map((label, index) => (
          <Steps.Item key={label} index={index}>
            {label}
          </Steps.Item>
        ))}
      </Steps.Root>
    </div>
  );
}
