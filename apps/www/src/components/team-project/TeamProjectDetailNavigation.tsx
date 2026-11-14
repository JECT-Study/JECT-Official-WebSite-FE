"use client";

import { useRouter } from "next/navigation";

import { LocalNavigation } from "@jects/jds";

import { ROUTES } from "@/constants/routes";

export function TeamProjectDetailNavigation() {
  const router = useRouter();

  return (
    <LocalNavigation
      title="팀 프로젝트"
      nested
      onBackClick={() => router.push(ROUTES.teamProject)}
      stretched
    />
  );
}
