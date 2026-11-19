import type { Metadata } from "next";

import { recruitApi } from "@/apis/recruit/api";
import { RecruitList } from "@/components/apply";
import { PageHeader } from "@/components/layout";
import { createPageMetadata } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

const PAGE_TITLE = "지원 안내";
const PAGE_DESCRIPTION = "함께 젝트를 만들어갈 새로운 구성원을 찾고 있습니다.";

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: ROUTES.applyList,
});

export default async function ApplyListPage() {
  const { recruitments } = await recruitApi.getActiveRecruitments();

  return (
    <>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <RecruitList recruitments={recruitments} />
    </>
  );
}
