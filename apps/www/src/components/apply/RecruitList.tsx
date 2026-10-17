"use client";

import { Fragment } from "react";
import { useSearchParams } from "next/navigation";

import { Card, Divider, EmptyState, Tabs } from "@jects/jds";

import type { ActiveRecruitment, RecruitType } from "@/apis/recruit/schemas";
import { PageHeader } from "@/components/layout";
import { EXTERNAL_LINKS } from "@/constants/links";
import { routeTo } from "@/constants/routes";

interface RecruitTab {
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

// 탭 순서는 키 순서를 따르고, 여기에 없는 모집 유형은 노출하지 않는다.
const RECRUIT_TABS = {
  SEMESTER: {
    label: "동아리원",
    empty: {
      header: "지금은 모집 기간이 아니에요",
      body: "다음 기수 모집 알림을 희망하시면 버튼을 눌러 신청해 주세요.",
      action: "모집 알림 신청",
      href: EXTERNAL_LINKS.recruitmentAlert,
    },
  },
  MAKERS: { label: "메이커스", empty: TALENT_POOL_EMPTY },
  SUPPORTERS: { label: "서포터즈", empty: TALENT_POOL_EMPTY },
} as const satisfies Partial<Record<RecruitType, RecruitTab>>;

type RecruitTabType = keyof typeof RECRUIT_TABS;

const TAB_TYPES = Object.keys(RECRUIT_TABS) as RecruitTabType[];

function toTabParam(type: RecruitTabType) {
  return type.toLowerCase();
}

function parseTabParam(param: string | null): RecruitTabType {
  return TAB_TYPES.find((type) => toTabParam(type) === param) ?? "SEMESTER";
}

function getJobFamilyName(recruitment: ActiveRecruitment): string {
  return recruitment.jobFamilyDescription.replace(/\s*\([A-Z]+\)$/, "");
}

function getRecruitTitle(recruitment: ActiveRecruitment): string {
  const round = recruitment.recruitTypeDetail === "REGULAR" ? "모집" : "추가 모집";

  return `[젝트 ${recruitment.semesterName}] ${getJobFamilyName(recruitment)} ${round}`;
}

// 서버가 오프셋 없는 LocalDateTime을 보내므로 Date로 바꾸지 않고 날짜 부분만 읽는다.
function parseDate(dateTime: string) {
  const [year, month, day] = dateTime.slice(0, 10).split("-").map(Number);

  return { year, month, day };
}

function formatRecruitPeriod(startDate: string, endDate: string): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const endLabel =
    start.year === end.year
      ? `${end.month}월 ${end.day}일`
      : `${end.year}년 ${end.month}월 ${end.day}일`;

  return `${start.year}년 ${start.month}월 ${start.day}일 - ${endLabel}`;
}

interface RecruitListProps {
  recruitments: ActiveRecruitment[];
}

export function RecruitList({ recruitments }: RecruitListProps) {
  const tab = parseTabParam(useSearchParams().get("type"));

  const handleTabChange = (value: string) => {
    // 서버 컴포넌트를 다시 요청하지 않도록 router 대신 history API로 URL만 변경한다.
    window.history.replaceState(null, "", `?type=${value}`);
  };

  return (
    <Tabs.Root value={toTabParam(tab)} onValueChange={handleTabChange}>
      <PageHeader
        title="지원 안내"
        description="함께 젝트를 만들어갈 새로운 구성원을 찾고 있습니다."
      >
        <Tabs.List aria-label="모집 유형">
          {TAB_TYPES.map((type) => (
            <Tabs.Trigger key={type} value={toTabParam(type)}>
              {RECRUIT_TABS[type].label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </PageHeader>
      {TAB_TYPES.map((type) => (
        <Tabs.Content key={type} value={toTabParam(type)}>
          <RecruitTabPanel
            type={type}
            recruitments={recruitments.filter((item) => item.recruitType === type)}
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

interface RecruitTabPanelProps {
  type: RecruitTabType;
  recruitments: ActiveRecruitment[];
}

function RecruitTabPanel({ type, recruitments }: RecruitTabPanelProps) {
  const { label, empty } = RECRUIT_TABS[type];

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
            date={formatRecruitPeriod(recruitment.startDate, recruitment.endDate)}
          />
        </Fragment>
      ))}
    </div>
  );
}
