import { useEffect, useState } from "react";

/** 주어진 시각이 되었는지 반환한다. 매초 갱신하지 않고 그 시각이 되는 시점에 한 번만 리렌더링한다. */
export function useIsTimeReached(time: number | null) {
  const [reachedTime, setReachedTime] = useState<number | null>(null);

  useEffect(() => {
    if (time === null) {
      return;
    }

    const timer = setTimeout(() => setReachedTime(time), time - Date.now());

    return () => clearTimeout(timer);
  }, [time]);

  return time !== null && reachedTime === time;
}
