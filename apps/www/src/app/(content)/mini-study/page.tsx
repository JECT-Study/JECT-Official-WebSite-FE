import type { Metadata } from "next";

import { miniStudyServerApi } from "@/apis/mini-study/api.server";
import { PageHeader } from "@/components/layout";
import { MiniStudyList } from "@/components/mini-study";
import { createPageMetadata } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "미니 스터디",
  description: "활동 중 팀 프로젝트와 병행할 수 있는, 성장을 위한 스터디입니다.",
  path: ROUTES.miniStudy,
});

export default async function MiniStudyPage() {
  const miniStudies = await miniStudyServerApi.getMiniStudies();

  return (
    <>
      <PageHeader
        title="미니 스터디"
        description="활동 중 팀 프로젝트와 병행할 수 있는, 성장을 위한 스터디입니다."
      />
      <MiniStudyList miniStudies={miniStudies} />
    </>
  );
}
