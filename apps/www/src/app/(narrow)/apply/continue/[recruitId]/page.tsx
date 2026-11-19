import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getJobFamilyName } from "@/components/apply/format";
import { getRecruit } from "@/components/apply/getRecruit";
import { routeTo } from "@/constants/routes";
import { ContinueFunnel } from "@/features/apply/ContinueFunnel";

export async function generateMetadata({
  params,
}: PageProps<"/apply/continue/[recruitId]">): Promise<Metadata> {
  const { recruit } = await getRecruit((await params).recruitId);

  return { title: `이어서 작성하기 | ${recruit.title}` };
}

export default async function ApplyContinuePage({
  params,
}: PageProps<"/apply/continue/[recruitId]">) {
  const { recruit, isClosed } = await getRecruit((await params).recruitId);

  if (isClosed) {
    redirect(routeTo.applyGuide(recruit.recruitId));
  }

  return (
    <ContinueFunnel
      recruitId={recruit.recruitId}
      recruitTitle={recruit.title}
      jobFamily={recruit.jobFamily}
      jobFamilyName={getJobFamilyName(recruit)}
    />
  );
}
