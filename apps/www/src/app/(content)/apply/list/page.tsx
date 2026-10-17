import type { Metadata } from "next";

import { recruitApi } from "@/apis/recruit/api";
import { RecruitList } from "@/components/apply";

export const metadata: Metadata = {
  title: "지원 안내",
};

export default async function ApplyListPage({ searchParams }: PageProps<"/apply/list">) {
  const [{ recruitments }, { type }] = await Promise.all([
    recruitApi.getActiveRecruitments(),
    searchParams,
  ]);

  return (
    <RecruitList
      recruitments={recruitments}
      tabParam={typeof type === "string" ? type : undefined}
    />
  );
}
