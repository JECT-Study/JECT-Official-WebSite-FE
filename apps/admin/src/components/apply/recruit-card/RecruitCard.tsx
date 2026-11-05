import type { components } from "@ject/api-types/admin";
import { Card, ContentBadge, Divider, type ThemeVariant } from "@jects/jds";

import { parseDate } from "@/utils/date";

type JobFamily = components["schemas"]["JobFamily"];
type RecruitCardProps = components["schemas"]["ApplyManagementRecruitResponse"];

interface JobFamilyBadge {
  label: string;
  color: ThemeVariant;
}

// 시안에 없는 직군은 라벨과 색이 정해지면 추가한다.
const JOB_FAMILY_BADGES: Partial<Record<JobFamily, JobFamilyBadge>> = {
  FE: { label: "프론트엔드 개발자", color: "green" },
  BE: { label: "백엔드 개발자", color: "sky" },
  APP: { label: "앱 개발자", color: "indigo" },
  PM: { label: "프로덕트 매니저", color: "orange" },
  PD: { label: "프로덕트 디자이너", color: "purple" },
};

function formatPeriod(startDate: string, endDate: string): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const endYear = start.year === end.year ? "" : `${end.year}. `;

  return `${start.year}. ${start.month}. ${start.day}. - ${endYear}${end.month}. ${end.day}.`;
}

function getDeadlineLabel(endDate: string, now = new Date()): string {
  const end = new Date(endDate);
  if (end < now) return "모집 마감";

  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysLeft = (endDay.getTime() - today.getTime()) / 86_400_000;

  return daysLeft === 0 ? "마감 D-Day" : `마감 D-${daysLeft}`;
}

export default function RecruitCard({
  title,
  jobFamily,
  startDate,
  endDate,
  submittedApplyCount = 0,
  passedCount = 0,
  failedCount = 0,
  waitlistedCount = 0,
}: RecruitCardProps) {
  const metaItems = [
    { label: "모집 기간", value: startDate && endDate ? formatPeriod(startDate, endDate) : "-" },
    { label: "지원서", value: submittedApplyCount },
    { label: "합/불/예비", value: `${passedCount}/${failedCount}/${waitlistedCount}` },
  ];

  return (
    <Card.Root variant="plate" className="overflow-hidden">
      <div className="flex flex-col gap-12 border-b border-stroke-subtle p-margin-sm">
        <Card.Title className="text-title-1 font-title-subtle">{title}</Card.Title>
        <div className="flex flex-wrap items-center gap-8">
          {jobFamily && (
            <ContentBadge
              variant={JOB_FAMILY_BADGES[jobFamily]?.color}
              badgeStyle="alpha"
              size="xs"
            >
              {JOB_FAMILY_BADGES[jobFamily]?.label ?? jobFamily}
            </ContentBadge>
          )}
          {endDate && (
            <ContentBadge hierarchy="tertiary" badgeStyle="alpha" size="xs">
              {getDeadlineLabel(endDate)}
            </ContentBadge>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-24 gap-y-8 bg-surface-standard px-margin-sm pt-margin-xs pb-margin-sm">
        {metaItems.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-8 text-label-sm">
            <span className="font-label-normal text-object-neutral">{label}</span>
            <Divider orientation="vertical" className="h-12 self-center" />
            <span className="font-label-bold text-object-bolder">{value}</span>
          </div>
        ))}
      </div>
    </Card.Root>
  );
}
