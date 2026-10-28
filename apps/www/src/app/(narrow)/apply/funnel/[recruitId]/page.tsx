import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRecruitTitle } from "@/components/apply/format";
import { getRecruit } from "@/components/apply/getRecruit";
import { routeTo } from "@/constants/routes";
import { ApplyFunnel } from "@/features/apply/ApplyFunnel";

export async function generateMetadata({
  params,
}: PageProps<"/apply/funnel/[recruitId]">): Promise<Metadata> {
  const { recruit } = await getRecruit((await params).recruitId);

  return { title: `지원서 작성 | ${getRecruitTitle(recruit)}` };
}

export default async function ApplyFunnelPage({ params }: PageProps<"/apply/funnel/[recruitId]">) {
  const { recruit, isClosed } = await getRecruit((await params).recruitId);

  if (isClosed) {
    redirect(routeTo.applyGuide(recruit.recruitId));
  }

  return <ApplyFunnel recruitId={recruit.recruitId} recruitTitle={getRecruitTitle(recruit)} />;
}
