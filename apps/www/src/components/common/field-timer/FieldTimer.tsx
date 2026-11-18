"use client";

import { useEffect, useState } from "react";

import { TextField } from "@jects/jds";

interface FieldTimerProps {
  deadline: number;
  totalSeconds: number;
}

export function FieldTimer({ deadline, totalSeconds }: FieldTimerProps) {
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

  return <TextField.Timer seconds={remainingSeconds} />;
}
