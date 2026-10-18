import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { recruitApi } from "@/apis/recruit/api";
import { RecruitContent, RecruitGuide } from "@/components/apply";
import { getRecruitTitle } from "@/components/apply/format";
import { hasErrorCode } from "@/errors/hasErrorCode";

const getRecruit = cache(async (recruitIdParam: string) => {
  const recruitId = Number(recruitIdParam);

  if (!Number.isInteger(recruitId) || recruitId <= 0) {
    notFound();
  }

  try {
    return await recruitApi.getRecruit(recruitId);
  } catch (error) {
    if (hasErrorCode(error, "RECRUIT-1")) {
      notFound();
    }

    throw error;
  }
});

export async function generateMetadata({
  params,
}: PageProps<"/apply/guide/[recruitId]">): Promise<Metadata> {
  const recruit = await getRecruit((await params).recruitId);

  return { title: getRecruitTitle(recruit) };
}

export default async function ApplyGuidePage({ params }: PageProps<"/apply/guide/[recruitId]">) {
  const recruit = await getRecruit((await params).recruitId);

  return (
    <RecruitGuide
      recruit={recruit}
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
