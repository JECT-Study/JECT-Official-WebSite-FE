import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRecruit } from "@/components/apply/getRecruit";
import { routeTo } from "@/constants/routes";
import { ResetPin } from "@/features/apply/reset-pin/ResetPin";

export async function generateMetadata({
  params,
}: PageProps<"/auth/reset-pin/[recruitId]">): Promise<Metadata> {
  const { recruit } = await getRecruit((await params).recruitId);

  return { title: `PIN 재설정 | ${recruit.title}` };
}

export default async function ResetPinPage({ params }: PageProps<"/auth/reset-pin/[recruitId]">) {
  const { recruit, isClosed } = await getRecruit((await params).recruitId);

  if (isClosed) {
    redirect(routeTo.applyGuide(recruit.recruitId));
  }

  return <ResetPin recruitId={recruit.recruitId} />;
}
