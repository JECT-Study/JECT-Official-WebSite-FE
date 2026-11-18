import { type APIRequestContext, expect } from "@playwright/test";

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
