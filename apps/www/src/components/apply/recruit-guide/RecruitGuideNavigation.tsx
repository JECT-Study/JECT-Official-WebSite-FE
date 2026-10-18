"use client";

import { useRouter } from "next/navigation";

import { LocalNavigation } from "@jects/jds";

import type { RecruitType } from "@/apis/recruit/schemas";
import { ROUTES } from "@/constants/routes";

interface RecruitGuideNavigationProps {
  recruitType: RecruitType;
}

export function RecruitGuideNavigation({ recruitType }: RecruitGuideNavigationProps) {
  const router = useRouter();

  return (
    <LocalNavigation
      title="지원 안내"
      nested
      onBackClick={() => router.push(`${ROUTES.applyList}?type=${recruitType.toLowerCase()}`)}
      stretched
    />
  );
}
