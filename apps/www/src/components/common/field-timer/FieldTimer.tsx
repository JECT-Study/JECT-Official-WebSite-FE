"use client";

import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

function formatRemaining(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

interface FieldTimerProps {
  deadline: number;
  totalSeconds: number;
  isError?: boolean;
}

export function FieldTimer({ deadline, totalSeconds, isError = false }: FieldTimerProps) {
  // 매초 갱신되는 상태를 이 컴포넌트에만 두고, 기한이 바뀌면 key로 다시 마운트한다.
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

      setRemainingSeconds(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <span
      className={cn(
        "ms-auto shrink-0 font-label text-label-sm font-label-normal whitespace-nowrap",
        isError ? "text-feedback-destructive-neutral" : "text-object-alternative"
      )}
    >
      {formatRemaining(remainingSeconds)}
    </span>
  );
}
