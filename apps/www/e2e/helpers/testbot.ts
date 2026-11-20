import { type APIRequestContext, expect } from "@playwright/test";

import { questionsSchema } from "@/apis/apply/schemas";
import type { JobFamily } from "@/apis/recruit/schemas";

export const TESTBOT_EMAIL = "testbot@ject.kr";

// 개발 서버는 testbot 계정에 메일을 보내지 않고 고정 인증번호를 발급한다.
export const TESTBOT_AUTH_CODE = "000000";

export const TESTBOT_PIN = "123456";

/** testbot의 지원 정보를 초기화한다. 운영 서버에는 이 API가 없으므로 dev가 아닌 환경에서는 여기서 테스트가 실패한다. */
export async function resetTestbot(request: APIRequestContext) {
  const response = await request.delete("/api/dev/testbot");

  expect(
    response.ok(),
    "testbot 초기화에 실패했습니다. dev API를 대상으로 실행하고 있는지 확인해주세요."
  ).toBe(true);
}

/**
 * testbot을 지원자로 등록한다.
 * 이후 준비 동작은 등록할 때 받은 인증 쿠키로 요청하므로 같은 `request`를 전달한다.
 */
export async function registerTestbot(request: APIRequestContext, recruitId: number) {
  const sendResponse = await request.post("/api/email/send/auth", {
    params: { email: TESTBOT_EMAIL, sendGroupCode: "AUTH_CODE" },
  });
  expect(sendResponse.ok(), "인증번호 발송에 실패했습니다.").toBe(true);

  const verifyResponse = await request.post("/api/auth/code", {
    params: { template: "AUTH_CODE" },
    data: { email: TESTBOT_EMAIL, authCode: TESTBOT_AUTH_CODE, recruitId },
  });
  expect(verifyResponse.ok(), "인증번호 확인에 실패했습니다.").toBe(true);

  const registerResponse = await request.post("/api/applicants/apply", {
    data: { pin: TESTBOT_PIN, recruitId },
  });
  expect(registerResponse.ok(), "지원자 등록에 실패했습니다.").toBe(true);
}

export async function saveTestbotProfile(
  request: APIRequestContext,
  recruitId: number,
  jobFamily: JobFamily
) {
  const response = await request.post("/api/apply/profile", {
    params: { recruitId },
    data: {
      name: "김젝트",
      phoneNumber: "01012345678",
      jobFamily,
      careerDetails: "STUDENT",
      region: "SEOUL",
      experiencePeriod: "NONE",
      interestedDomains: ["EDUCATION"],
    },
  });
  expect(response.ok(), "프로필 저장에 실패했습니다.").toBe(true);
}

/** 첫 번째 텍스트 질문의 답변을 임시 저장하고 그 질문을 반환한다. */
export async function saveTestbotTempAnswer(
  request: APIRequestContext,
  recruitId: number,
  answer: string
) {
  const questionsResponse = await request.get("/api/apply/questions", { params: { recruitId } });
  const { data } = await questionsResponse.json();
  const question = questionsSchema
    .parse(data)
    .questionResponses.find(({ inputType }) => inputType === "TEXT");

  expect(question, "텍스트 질문이 없습니다.").toBeDefined();

  const response = await request.post("/api/apply/temp", {
    params: { recruitId },
    data: { answers: { [String(question!.id)]: answer }, portfolios: [] },
  });
  expect(response.ok(), "지원서 임시 저장에 실패했습니다.").toBe(true);

  return question!;
}
