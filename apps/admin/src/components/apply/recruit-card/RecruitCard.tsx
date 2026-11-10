import { Card, ContentBadge, Divider } from "@jects/jds";
import { useLinkClickHandler } from "react-router-dom";

import type { ApplyManagementRecruit } from "@/apis/recruit/schemas";
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";
import { routeTo } from "@/constants/routes";
import { parseDate } from "@/utils/date";

type RecruitCardProps = ApplyManagementRecruit;

function formatPeriod(startDate: string, endDate: string): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const endYear = start.year === end.year ? "" : `${end.year}. `;

  return `${start.year}. ${start.month}. ${start.day}. - ${endYear}${end.month}. ${end.day}.`;
}

function getDeadlineLabel(endDate: string): string {
  const now = new Date();

  // 서버 날짜는 오프셋 없는 한국 시각이므로 +09:00을 붙여 해석한다.
  if (new Date(`${endDate}+09:00`) < now) return "모집 마감";

  const endDayStart = new Date(`${endDate.slice(0, 10)}T00:00:00+09:00`);
  const daysLeft = Math.ceil((endDayStart.getTime() - now.getTime()) / 86_400_000);

  return daysLeft <= 0 ? "마감 D-Day" : `마감 D-${daysLeft}`;
}

export default function RecruitCard({
  recruitId,
  title,
  semesterName,
  jobFamily,
  startDate,
  endDate,
  submittedApplyCount,
  passedCount,
  failedCount,
  waitlistedCount,
}: RecruitCardProps) {
  const to = routeTo.submittedRecruitApplies(recruitId);
  // TODO: JDS Card.Overlay가 라우팅 컴포넌트를 지원하면 react-router의 Link로 교체한다.
  const handleClick = useLinkClickHandler(to);

  const metaItems = [
    { label: "모집 기간", value: formatPeriod(startDate, endDate) },
    { label: "지원서", value: submittedApplyCount },
    { label: "합/불/예비", value: `${passedCount}/${failedCount}/${waitlistedCount}` },
  ];

  return (
    <Card.Root variant="plate" interactive className="overflow-hidden">
      <div className="flex flex-col gap-12 border-b border-stroke-subtle p-margin-sm">
        <Card.Title className="text-title-1 font-title-subtle break-keep whitespace-normal">
          {/* 제목이 없는 공고는 제목이 있는 공고와 같은 형식으로 만들어 표시한다. */}
          {title ??
            `[젝트 ${semesterName}] ${JOB_FAMILY_BADGES[jobFamily]?.label ?? jobFamily} 모집`}
        </Card.Title>
        <div className="flex flex-wrap items-center gap-8">
          <ContentBadge variant={JOB_FAMILY_BADGES[jobFamily]?.color} badgeStyle="alpha" size="xs">
            {JOB_FAMILY_BADGES[jobFamily]?.label ?? jobFamily}
          </ContentBadge>
          <ContentBadge hierarchy="tertiary" badgeStyle="alpha" size="xs">
            {getDeadlineLabel(endDate)}
          </ContentBadge>
        </div>
      </div>
      <div className="flex flex-col gap-x-24 gap-y-8 bg-surface-standard px-margin-sm pt-margin-xs pb-margin-sm desktop:flex-row desktop:flex-wrap">
        {metaItems.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-12 text-label-sm desktop:gap-8">
            <span className="w-72 shrink-0 font-label-normal text-object-neutral desktop:w-auto">
              {label}
            </span>
            <Divider orientation="vertical" className="h-12 self-center max-desktop:hidden" />
            <span className="font-label-bold text-object-bolder">{value}</span>
          </div>
        ))}
      </div>
      <Card.Overlay href={to} onClick={handleClick} />
    </Card.Root>
  );
}
