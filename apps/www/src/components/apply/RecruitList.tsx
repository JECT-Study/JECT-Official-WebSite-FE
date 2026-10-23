"use client";

import { Fragment } from "react";
import { useSearchParams } from "next/navigation";

import { Card, Divider, EmptyState, Tabs } from "@jects/jds";

import type { ActiveRecruitment, RecruitType } from "@/apis/recruit/schemas";
import { EXTERNAL_LINKS } from "@/constants/links";
import { routeTo } from "@/constants/routes";
import { formatDate } from "@/utils/formatDate";

interface RecruitTab {
  type: RecruitType;
  label: string;
  empty: {
    header: string;
    body: string;
    action: string;
    href: string;
  };
}

const TALENT_POOL_EMPTY = {
  header: "지금은 모집 중인 공고가 없어요",
  body: "인재풀 등록을 희망하시면 버튼을 눌러 신청해 주세요.",
  action: "인재풀 등록",
  href: EXTERNAL_LINKS.talentPool,
};

// 여기에 없는 모집 유형은 노출하지 않는다.
const TABS = [
  {
    type: "SEMESTER",
    label: "동아리원",
    empty: {
      header: "지금은 모집 기간이 아니에요",
      body: "다음 기수 모집 알림을 희망하시면 버튼을 눌러 신청해 주세요.",
      action: "모집 알림 신청",
      href: EXTERNAL_LINKS.recruitmentAlert,
    },
  },
  { type: "MAKERS", label: "메이커스", empty: TALENT_POOL_EMPTY },
  { type: "SUPPORTERS", label: "서포터즈", empty: TALENT_POOL_EMPTY },
] as const satisfies RecruitTab[];

function toTabParam(type: RecruitType) {
  return type.toLowerCase();
}

function parseTabParam(param: string | null): RecruitTab {
  return TABS.find((tab) => toTabParam(tab.type) === param) ?? TABS[0];
}

function getJobFamilyName(recruitment: ActiveRecruitment): string {
  return recruitment.jobFamilyDescription.replace(/\s*\([A-Z]+\)$/, "");
}

function getRecruitTitle(recruitment: ActiveRecruitment): string {
  const round = recruitment.recruitTypeDetail === "REGULAR" ? "모집" : "추가 모집";

  return `[젝트 ${recruitment.semesterName}] ${getJobFamilyName(recruitment)} ${round}`;
}

interface RecruitTabPanelProps {
  tab: RecruitTab;
  recruitments: ActiveRecruitment[];
}

function RecruitTabPanel({ tab, recruitments }: RecruitTabPanelProps) {
  const { label, empty } = tab;

  if (recruitments.length === 0) {
    return (
      <EmptyState
        header={empty.header}
        body={empty.body}
        primaryAction={{
          children: empty.action,
          onClick: () => window.open(empty.href, "_blank", "noopener,noreferrer"),
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-24">
      {recruitments.map((recruitment, index) => (
        <Fragment key={recruitment.recruitId}>
          {index > 0 && <Divider />}
          <Card.Preset.Post.Link
            layout="horizontal"
            href={routeTo.applyGuide(recruitment.recruitId)}
            title={getRecruitTitle(recruitment)}
            body={recruitment.summary}
            author={label}
            date={`${formatDate(recruitment.startDate)} - ${formatDate(recruitment.endDate)}`}
          />
        </Fragment>
      ))}
    </div>
  );
}

interface RecruitListProps {
  recruitments: ActiveRecruitment[];
}

export function RecruitList({ recruitments }: RecruitListProps) {
  const selectedTab = parseTabParam(useSearchParams().get("type"));

  const handleTabChange = (value: string) => {
    // 서버 컴포넌트를 다시 요청하지 않도록 router 대신 history API로 URL만 변경한다.
    window.history.replaceState(null, "", `?type=${value}`);
  };

  return (
    <Tabs.Root
      value={toTabParam(selectedTab.type)}
      onValueChange={handleTabChange}
      className="flex flex-col gap-48"
    >
      <Tabs.List aria-label="모집 유형">
        {TABS.map((tab) => (
          <Tabs.Trigger key={tab.type} value={toTabParam(tab.type)}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {TABS.map((tab) => (
        <Tabs.Content key={tab.type} value={toTabParam(tab.type)}>
          <RecruitTabPanel
            tab={tab}
            recruitments={recruitments.filter((item) => item.recruitType === tab.type)}
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
