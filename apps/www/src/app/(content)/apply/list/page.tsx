import type { Metadata } from "next";

import { recruitApi } from "@/apis/recruit/api";
import { RecruitList } from "@/components/apply";

export const metadata: Metadata = {
  title: "지원 안내",
};

export default async function ApplyListPage() {
  const { recruitments } = await recruitApi.getActiveRecruitments();

  return <RecruitList recruitments={recruitments} />;
}
