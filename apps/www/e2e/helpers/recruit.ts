import { type APIRequestContext, expect } from "@playwright/test";

import { activeRecruitmentsSchema } from "@/apis/recruit/schemas";

export async function getActiveRecruits(request: APIRequestContext) {
  const response = await request.get("/api/recruits/active");
  const { data } = await response.json();
  const { recruitments } = activeRecruitmentsSchema.parse(data);

  expect(recruitments.length, "모집 중인 공고가 없습니다.").toBeGreaterThan(0);

  return recruitments;
}

export async function getActiveRecruit(request: APIRequestContext) {
  const [recruit] = await getActiveRecruits(request);

  return recruit;
}

export async function getActiveRecruitId(request: APIRequestContext) {
  const { recruitId } = await getActiveRecruit(request);

  return recruitId;
}
