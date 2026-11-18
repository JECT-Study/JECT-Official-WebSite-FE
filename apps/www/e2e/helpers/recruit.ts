import { type APIRequestContext, expect } from "@playwright/test";

import { activeRecruitmentsSchema } from "@/apis/recruit/schemas";

export async function getActiveRecruitId(request: APIRequestContext) {
  const response = await request.get("/api/recruits/active");
  const { data } = await response.json();
  const [recruit] = activeRecruitmentsSchema.parse(data).recruitments;

  expect(recruit, "모집 중인 공고가 없습니다.").toBeDefined();

  return recruit.recruitId;
}
