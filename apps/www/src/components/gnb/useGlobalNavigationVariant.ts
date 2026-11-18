"use client";

import { useEffect, useState } from "react";

export type GlobalNavigationVariant = "empty" | "solid";

/** 스크롤 위치로 GNB 배경 유무를 정한다. 서버 렌더 결과와 맞추기 위해 초기값은 empty로 둔다. */
export function useGlobalNavigationVariant(): GlobalNavigationVariant {
  const [variant, setVariant] = useState<GlobalNavigationVariant>("empty");

  useEffect(() => {
    const handleScroll = () => {
      setVariant(window.scrollY > 0 ? "solid" : "empty");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return variant;
}
