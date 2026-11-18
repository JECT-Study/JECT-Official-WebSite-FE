import type { Metadata } from "next";

import { recruitApi } from "@/apis/recruit/api";
import { RecruitList } from "@/components/apply";
import { PageHeader } from "@/components/layout";

export const metadata: Metadata = {
  title: "지원 안내",
};

export default async function ApplyListPage() {
  const { recruitments } = await recruitApi.getActiveRecruitments();

  return (
    <>
      <PageHeader
        title="지원 안내"
        description="함께 젝트를 만들어갈 새로운 구성원을 찾고 있습니다."
      />
      <RecruitList recruitments={recruitments} />
    </>
  );
}
