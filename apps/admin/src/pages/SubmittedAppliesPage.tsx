import { useState } from "react";

import type { components } from "@ject/api-types/admin";
import { EmptyState, Tabs } from "@jects/jds";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { recruitApi } from "@/apis/recruit/api";
import { recruitQueryKeys } from "@/apis/recruit/queryKeys";
import JobFamilyFilterButton from "@/components/apply/job-family-filter/JobFamilyFilterButton";
import RecruitCard from "@/components/apply/recruit-card/RecruitCard";
import type { JobFamily } from "@/constants/jobFamily";

type RecruitType = components["schemas"]["RecruitType"];

// TODO: 무한 스크롤을 구현하기 전까지 허용된 최대 개수로 한 번에 받는다.
const PAGE_SIZE = 100;

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
  const [recruitType, setRecruitType] = useState<RecruitType>(RECRUIT_TABS[0].type);
  const [jobFamilies, setJobFamilies] = useState<JobFamily[]>([]);

  const selectedTab = RECRUIT_TABS.find(({ type }) => type === recruitType) ?? RECRUIT_TABS[0];

  const query = { status: "SUBMITTED", recruitType, jobFamilies, size: PAGE_SIZE } as const;
  const { data, isError } = useQuery({
    queryKey: recruitQueryKeys.applyManagementRecruits(query),
    queryFn: () => recruitApi.getApplyManagementRecruits(query),
    placeholderData: keepPreviousData,
  });

  const handleTabChange = (value: string) => {
    const tab = RECRUIT_TABS.find(({ type }) => type === value);
    if (!tab) return;
    setRecruitType(tab.type);
    setJobFamilies([]);
  };

  const recruitTypeCounts = data?.recruitTypeCounts ?? [];
  const totalCount = recruitTypeCounts.reduce((sum, { count }) => sum + count, 0);

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
          {isError && (
            <EmptyState
              header="공고 목록을 불러오지 못했습니다"
              body="잠시 후 다시 시도해 주세요."
            />
          )}
          {data?.recruits.content.length === 0 && (
            <EmptyState
              header="현재 등록된 공고가 없습니다"
              body="새로운 공고가 등록되면 확인할 수 있어요."
            />
          )}
          {data?.recruits.content.map((recruit) => (
            <RecruitCard key={recruit.recruitId} {...recruit} />
          ))}
        </div>
      </Tabs.Root>
    </section>
  );
}
