import { useState } from "react";

import type { components } from "@ject/api-types/admin";
import { Tabs } from "@jects/jds";

import JobFamilyFilterButton from "@/components/apply/job-family-filter/JobFamilyFilterButton";
import RecruitCard from "@/components/apply/recruit-card/RecruitCard";

type ApplyManagementRecruitsResponse = components["schemas"]["ApplyManagementRecruitsResponse"];
type RecruitType = components["schemas"]["RecruitType"];

// status=SUBMITTED, recruitType=SEMESTER 요청의 응답을 가정한 임시 값이다.
const DATA: ApplyManagementRecruitsResponse = {
  recruitTypeCounts: [
    { recruitType: "SEMESTER", count: 5 },
    { recruitType: "MAKERS", count: 2 },
    { recruitType: "SUPPORTERS", count: 2 },
  ],
  recruits: {
    content: [
      {
        recruitId: 1,
        title: "젝트 5기 프론트엔드 개발자(FE) 모집",
        semesterId: 5,
        semesterName: "5기",
        recruitType: "SEMESTER",
        jobFamily: "FE",
        startDate: "2026-04-11T00:00:00",
        endDate: "2026-04-18T23:59:59",
        submittedApplyCount: 127,
        passedCount: 30,
        failedCount: 90,
        waitlistedCount: 7,
      },
      {
        recruitId: 2,
        title: "젝트 5기 백엔드 개발자(BE) 모집",
        semesterId: 5,
        semesterName: "5기",
        recruitType: "SEMESTER",
        jobFamily: "BE",
        startDate: "2026-04-11T00:00:00",
        endDate: "2026-04-18T23:59:59",
        submittedApplyCount: 108,
        passedCount: 25,
        failedCount: 78,
        waitlistedCount: 5,
      },
      {
        recruitId: 3,
        title: "젝트 5기 앱 개발자(AE) 모집",
        semesterId: 5,
        semesterName: "5기",
        recruitType: "SEMESTER",
        jobFamily: "APP",
        startDate: "2026-04-11T00:00:00",
        endDate: "2026-04-18T23:59:59",
        submittedApplyCount: 108,
        passedCount: 20,
        failedCount: 84,
        waitlistedCount: 4,
      },
      {
        recruitId: 4,
        title: "젝트 5기 프로덕트 매니저(PM) 모집",
        semesterId: 5,
        semesterName: "5기",
        recruitType: "SEMESTER",
        jobFamily: "PM",
        startDate: "2026-04-11T00:00:00",
        endDate: "2026-04-18T23:59:59",
        submittedApplyCount: 34,
        passedCount: 8,
        failedCount: 24,
        waitlistedCount: 2,
      },
      {
        recruitId: 5,
        title: "젝트 5기 프로덕트 디자이너(PD) 모집",
        semesterId: 5,
        semesterName: "5기",
        recruitType: "SEMESTER",
        jobFamily: "PD",
        startDate: "2026-04-11T00:00:00",
        endDate: "2026-04-18T23:59:59",
        submittedApplyCount: 34,
        passedCount: 8,
        failedCount: 23,
        waitlistedCount: 3,
      },
    ],
    size: 20,
    hasNext: false,
    totalCount: 5,
  },
};

const RECRUIT_TABS = [
  {
    type: "SEMESTER",
    label: "일반 구성원",
    jobFamilies: ["FE", "BE", "APP", "PM", "PD"],
    filterWidth: "200px",
  },
  {
    type: "MAKERS",
    label: "메이커스 팀",
    jobFamilies: ["FE", "BE", "APP", "PM", "PD"],
    filterWidth: "200px",
  },
  {
    type: "SUPPORTERS",
    label: "운영 서포터즈",
    jobFamilies: ["OPS", "INFRA", "BX", "ER"],
    filterWidth: "140px",
  },
] as const;

export default function SubmittedAppliesPage() {
  const [recruitType, setRecruitType] = useState<string>(RECRUIT_TABS[0].type);
  const [jobFamilies, setJobFamilies] = useState<string[]>([]);

  const selectedTab = RECRUIT_TABS.find(({ type }) => type === recruitType) ?? RECRUIT_TABS[0];

  const handleTabChange = (type: string) => {
    setRecruitType(type);
    setJobFamilies([]);
  };

  const recruitTypeCounts = DATA.recruitTypeCounts ?? [];
  const totalCount = recruitTypeCounts.reduce((sum, { count = 0 }) => sum + count, 0);

  const getRecruitTypeCount = (type: RecruitType) =>
    recruitTypeCounts.find(({ recruitType }) => recruitType === type)?.count ?? 0;

  return (
    <section className="flex flex-col">
      <div className="flex items-center gap-16 px-margin-xl py-12 tablet:px-margin-lg desktop:px-margin-xl">
        <h2 className="text-title-2 font-title-subtle text-object-boldest">공고 목록</h2>
        <p className="text-label-md font-label-normal text-object-bold">{totalCount}개의 항목</p>
      </div>
      <Tabs.Root
        value={selectedTab.type}
        onValueChange={handleTabChange}
        className="flex flex-col gap-16 px-margin-lg py-16 desktop:px-margin-xl"
      >
        <Tabs.List className="border-b-0">
          {RECRUIT_TABS.map(({ type, label }) => (
            <Tabs.Trigger key={type} value={type}>
              {label} {getRecruitTypeCount(type)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="border-b border-stroke-alpha-subtle py-10">
          <JobFamilyFilterButton
            jobFamilies={selectedTab.jobFamilies}
            width={selectedTab.filterWidth}
            value={jobFamilies}
            onChange={setJobFamilies}
          />
        </div>
        <div className="flex flex-col gap-12">
          {DATA.recruits?.content?.map((recruit) => (
            <RecruitCard key={recruit.recruitId} {...recruit} />
          ))}
        </div>
      </Tabs.Root>
    </section>
  );
}
