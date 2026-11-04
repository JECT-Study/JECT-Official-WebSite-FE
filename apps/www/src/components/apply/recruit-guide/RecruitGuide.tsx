import type { ReactNode } from "react";
import Link from "next/link";

import { BlockButton } from "@jects/jds";

import type { Recruit } from "@/apis/recruit/schemas";
import { routeTo } from "@/constants/routes";
import { formatDate } from "@/utils/formatDate";

import { getRecruitTitle } from "../format";
import { CopyUrlButton } from "./CopyUrlButton";
import { RecruitGuideNavigation } from "./RecruitGuideNavigation";
import { type RecruitFaq, RecruitGuideTabs } from "./RecruitGuideTabs";

interface RecruitGuideProps {
  recruit: Recruit;
  isClosed: boolean;
  information: ReactNode;
  notice: ReactNode;
  faqs: RecruitFaq[];
}

export function RecruitGuide({ recruit, isClosed, information, notice, faqs }: RecruitGuideProps) {
  const title = getRecruitTitle(recruit);
  const lastSpaceIndex = title.lastIndexOf(" ");

  return (
    <>
      <RecruitGuideNavigation recruitType={recruit.recruitType} />

      <section className="flex flex-col gap-32 pt-margin-xl pb-margin-3xl">
        <div className="flex flex-col gap-16">
          <h1
            aria-label={title}
            className="font-title text-title-5 font-title-bold break-keep text-object-boldest"
          >
            {title.slice(0, lastSpaceIndex + 1)}
            {/* URL 복사 버튼만 다음 줄로 넘어가지 않도록 마지막 단어와 묶는다. */}
            <span className="inline-flex items-center gap-8 whitespace-nowrap">
              {title.slice(lastSpaceIndex + 1)}
              <CopyUrlButton />
            </span>
          </h1>
          <p className="font-label text-label-lg font-label-bold text-object-neutral">
            <span className="whitespace-nowrap">{formatDate(recruit.startDate)}</span> -{" "}
            <span className="whitespace-nowrap">{formatDate(recruit.endDate)}</span>
          </p>
        </div>

        <div className="flex gap-12">
          {isClosed ? (
            <BlockButton hierarchy="accent" size="lg" className="flex-1" disabled>
              모집이 마감되었습니다
            </BlockButton>
          ) : (
            <>
              <BlockButton asChild variant="outlined" hierarchy="secondary" size="lg">
                <Link href={routeTo.applyContinue(recruit.recruitId)}>이어서 작성하기</Link>
              </BlockButton>
              <BlockButton
                asChild
                hierarchy="accent"
                size="lg"
                suffixIcon="arrow-right"
                className="flex-1"
              >
                <Link href={routeTo.applyFunnel(recruit.recruitId)}>지원서 작성하기</Link>
              </BlockButton>
            </>
          )}
        </div>
      </section>

      <RecruitGuideTabs information={information} notice={notice} faqs={faqs} />
    </>
  );
}
