"use client";

import Link from "next/link";

import { BlockButton } from "@jects/jds";

import { ROUTES } from "@/constants/routes";
import { trackApplyStart } from "@/utils/analytics";

export function JoinApplyButton() {
  return (
    <BlockButton asChild hierarchy="accent" size="lg" suffixIcon="arrow-right">
      <Link href={ROUTES.applyList} onClick={() => trackApplyStart("home_join_section")}>
        지원하러 가기
      </Link>
    </BlockButton>
  );
}
