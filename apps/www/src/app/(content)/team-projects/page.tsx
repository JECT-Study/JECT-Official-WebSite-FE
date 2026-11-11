import type { Metadata } from "next";

import { projectServerApi } from "@/apis/project/api.server";
import { PageHeader } from "@/components/layout";
import { TeamProjectList } from "@/components/team-project";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "팀 프로젝트",
};

export default async function TeamProjectsPage() {
  const [summary, initialPage] = await Promise.all([
    projectServerApi.getSummary(),
    projectServerApi.getProjects(null, 0),
  ]);

  return (
    <>
      <PageHeader
        title="팀 프로젝트"
        description="젝트에서 진행한 팀 프로젝트들을 소개합니다."
        className="pb-32"
      />
      <TeamProjectList summary={summary} initialPage={initialPage} />
    </>
  );
}
