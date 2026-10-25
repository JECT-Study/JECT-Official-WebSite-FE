import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { recruitApi } from "@/apis/recruit/api";
import type { Recruit } from "@/apis/recruit/schemas";
import { RecruitContent, RecruitGuide } from "@/components/apply";
import { getRecruitTitle } from "@/components/apply/format";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { parseIdParam } from "@/utils/parseIdParam";

function parseKstDateTime(dateTime: string) {
  return new Date(`${dateTime}+09:00`);
}

const getRecruit = cache(async (recruitIdParam: string) => {
  const recruitId = parseIdParam(recruitIdParam);

  if (recruitId === null) {
    notFound();
  }

  let recruit: Recruit;

  try {
    recruit = await recruitApi.getRecruit(recruitId);
  } catch (error) {
    if (hasErrorCode(error, "RECRUIT-1")) {
      notFound();
    }

    throw error;
  }

  const now = Date.now();

  // 시작 전 공고는 목록에 노출되지 않으므로 아직 공개되지 않은 것으로 본다.
  if (now < parseKstDateTime(recruit.startDate).getTime()) {
    notFound();
  }

  return { recruit, isClosed: now > parseKstDateTime(recruit.endDate).getTime() };
});

export async function generateMetadata({
  params,
}: PageProps<"/apply/guide/[recruitId]">): Promise<Metadata> {
  const { recruit } = await getRecruit((await params).recruitId);

  return { title: getRecruitTitle(recruit) };
}

export default async function ApplyGuidePage({ params }: PageProps<"/apply/guide/[recruitId]">) {
  const { recruit, isClosed } = await getRecruit((await params).recruitId);

  return (
    <RecruitGuide
      recruit={recruit}
      isClosed={isClosed}
      information={
        recruit.recruitInformation && <RecruitContent html={recruit.recruitInformation} />
      }
      notice={recruit.notice && <RecruitContent html={recruit.notice} />}
      faqs={recruit.faqs.map((faq) => ({
        title: faq.title,
        content: <RecruitContent html={faq.content} />,
      }))}
    />
  );
}
