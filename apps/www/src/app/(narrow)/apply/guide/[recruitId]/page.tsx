import type { Metadata } from "next";

import { RecruitContent, RecruitGuide } from "@/components/apply";
import { getRecruitTitle } from "@/components/apply/format";
import { getRecruit } from "@/components/apply/getRecruit";

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
