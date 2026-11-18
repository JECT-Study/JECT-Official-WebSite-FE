import type { Metadata } from "next";

import { miniStudyServerApi } from "@/apis/mini-study/api.server";
import { PageHeader } from "@/components/layout";
import { MiniStudyList } from "@/components/mini-study";
import { createPageMetadata } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

export const revalidate = 3600;

const PAGE_TITLE = "미니 스터디";
const PAGE_DESCRIPTION = "활동 중 팀 프로젝트와 병행할 수 있는, 성장을 위한 스터디입니다.";

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: ROUTES.miniStudy,
});

export default async function MiniStudyPage() {
  const miniStudies = await miniStudyServerApi.getMiniStudies();

  return (
    <>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <MiniStudyList miniStudies={miniStudies} />
    </>
  );
}
