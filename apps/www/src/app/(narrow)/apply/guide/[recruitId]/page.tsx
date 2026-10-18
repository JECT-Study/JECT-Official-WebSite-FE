import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { recruitApi } from "@/apis/recruit/api";
import { RecruitContent, RecruitGuide } from "@/components/apply";

export const metadata: Metadata = {
  title: "지원 안내",
};

export default async function ApplyGuidePage({ params }: PageProps<"/apply/guide/[recruitId]">) {
  const recruitId = Number((await params).recruitId);

  if (!Number.isInteger(recruitId) || recruitId <= 0) {
    notFound();
  }

  const recruit = await recruitApi.getRecruit(recruitId);

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
