import { cache } from "react";
import { notFound } from "next/navigation";

import { recruitApi } from "@/apis/recruit/api";
import type { Recruit } from "@/apis/recruit/schemas";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { parseIdParam } from "@/utils/parseIdParam";

function parseKstDateTime(dateTime: string) {
  return new Date(`${dateTime}+09:00`);
}

export const getRecruit = cache(async (recruitIdParam: string) => {
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
