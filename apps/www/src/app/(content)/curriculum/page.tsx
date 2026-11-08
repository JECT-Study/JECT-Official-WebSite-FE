import type { Metadata } from "next";

import { CurriculumTabs, FigmaGuideCard, TeamProjectCard } from "@/components/curriculum";
import { PageHeader } from "@/components/layout";
import { FIGMA_GUIDE_CURRICULUM, TEAM_PROJECT_SCHEDULE } from "@/constants/curriculum";

const CARD_GRID = "grid grid-cols-1 gap-16 tablet:grid-cols-2";

export const metadata: Metadata = {
  title: "활동 커리큘럼",
};

export default function CurriculumPage() {
  return (
    <>
      <PageHeader
        title="활동 커리큘럼"
        description="젝트의 구성원이 참여하는 커리큘럼을 소개합니다."
      />
      <CurriculumTabs
        tabs={[
          {
            value: "team-project",
            label: "팀 프로젝트 일정",
            className: CARD_GRID,
            content: TEAM_PROJECT_SCHEDULE.map((event) => (
              <TeamProjectCard key={event.title} event={event} />
            )),
          },
          {
            value: "figma-guide",
            label: "피그마 가이드 커리큘럼",
            className: CARD_GRID,
            content: FIGMA_GUIDE_CURRICULUM.map((chapter, index) => (
              <FigmaGuideCard key={chapter.title} order={index + 1} chapter={chapter} />
            )),
          },
        ]}
      />
    </>
  );
}
