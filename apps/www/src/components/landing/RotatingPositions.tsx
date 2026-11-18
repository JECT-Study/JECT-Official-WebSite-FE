"use client";

import { useEffect, useState } from "react";

import { Icon } from "@jects/jds";

import { ROTATING_POSITIONS } from "@/constants/landing";
import { cn } from "@/utils/cn";

const DELAY_MS = 800;
const DURATION_MS = 500;

const ITEMS = [...ROTATING_POSITIONS, ROTATING_POSITIONS[0]];
const LAST_INDEX = ITEMS.length - 1;

export function RotatingPositions() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setIndex((current) => Math.min(current + 1, LAST_INDEX));
    }, DELAY_MS + DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index !== LAST_INDEX) return;

    // 복제한 첫 항목으로 전환이 끝나면 전환 없이 실제 첫 항목으로 되돌린다.
    const timeout = setTimeout(() => {
      setIsAnimating(false);
      setIndex(0);
    }, DURATION_MS);

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <span className="inline-flex h-lh overflow-hidden">
      <span
        className={cn(
          "flex flex-col",
          isAnimating
            ? "transition-transform ease-bouncy motion-reduce:transition-none"
            : "transition-none"
        )}
        style={{
          transform: `translateY(-${index * 100}%)`,
          transitionDuration: `${DURATION_MS}ms`,
        }}
      >
        {ITEMS.map(({ icon, text }, itemIndex) => (
          <span key={itemIndex} className="flex h-lh items-center justify-center gap-10">
            <Icon name={icon} size="3xl" aria-hidden className="shrink-0 tablet:hidden" />
            <Icon name={icon} size="4xl" aria-hidden className="shrink-0 max-tablet:hidden" />
            {text}
          </span>
        ))}
      </span>
    </span>
  );
}
