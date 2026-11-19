import type { Metadata } from "next";

import { projectServerApi } from "@/apis/project/api.server";
import { PageHeader } from "@/components/layout";
import { TeamProjectList } from "@/components/team-project";
import { createPageMetadata } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

export const revalidate = 3600;

const PAGE_TITLE = "팀 프로젝트";
const PAGE_DESCRIPTION = "젝트에서 진행한 팀 프로젝트들을 소개합니다.";

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: ROUTES.teamProject,
});

export default async function TeamProjectsPage() {
  const [summary, initialPage] = await Promise.all([
    projectServerApi.getSummary(),
    projectServerApi.getProjects(null, 0),
  ]);

  return (
    <>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} className="pb-32" />
      <TeamProjectList summary={summary} initialPage={initialPage} />
    </>
  );
}
