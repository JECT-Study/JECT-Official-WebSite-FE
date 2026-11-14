"use client";

import "lenis/dist/lenis.css";

import { type ReactNode, type RefObject, useEffect, useRef } from "react";

import { ReactLenis, useLenis } from "lenis/react";
import Snap from "lenis/snap";

interface SectionSnapProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

function SectionSnap({ containerRef }: SectionSnapProps) {
  const lenis = useLenis();

  useEffect(() => {
    const container = containerRef.current;

    if (
      !lenis ||
      !container ||
      lenis.prefersReducedMotion ||
      // 터치 기기의 기본 스크롤 동작과 스냅이 충돌할 수 있어 적용하지 않는다.
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const snap = new Snap(lenis, { type: "proximity", distanceThreshold: "25%" });
    const sections = Array.from(container.querySelectorAll<HTMLElement>(":scope > section"));

    snap.addElements(sections, { align: ["start"] });

    return () => snap.destroy();
  }, [lenis, containerRef]);

  return null;
}

interface LandingScrollProps {
  children: ReactNode;
}

export function LandingScroll({ children }: LandingScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ReactLenis root>
      <div ref={containerRef}>{children}</div>
      <SectionSnap containerRef={containerRef} />
    </ReactLenis>
  );
}
