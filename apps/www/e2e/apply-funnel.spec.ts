import { expect, test } from "@playwright/test";

import { getActiveRecruitId } from "./helpers/recruit";
import { resetTestbot, TESTBOT_AUTH_CODE, TESTBOT_EMAIL, TESTBOT_PIN } from "./helpers/testbot";

// 모든 테스트가 testbot 계정 하나를 초기화해 사용하므로 동시에 실행하지 않는다.
test.describe.configure({ mode: "serial" });

test.describe("지원 퍼널", () => {
  test.beforeEach(async ({ request }) => {
    await resetTestbot(request);
  });

  test("지원자가 인증부터 지원서 제출까지 완료할 수 있다", async ({ page, request }) => {
    const recruitId = await getActiveRecruitId(request);

    await page.goto(`/apply/funnel/${recruitId}`);

    await test.step("이메일 인증", async () => {
      await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
      await page.getByRole("button", { name: "인증번호 받기" }).click();
      await page.getByRole("textbox", { name: "인증번호" }).fill(TESTBOT_AUTH_CODE);
      await page.getByRole("button", { name: "인증하기" }).click();

      await expect(page.getByText("인증에 성공했습니다.")).toBeVisible();
    });

    await test.step("PIN 설정과 약관 동의", async () => {
      await page.getByLabel("PIN 설정").fill(TESTBOT_PIN);

      for (const checkbox of await page.getByRole("checkbox").all()) {
        await checkbox.check();
      }

      await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();
    });

    await test.step("프로필 작성", async () => {
      await expect(page.getByRole("heading", { name: "프로필 작성" })).toBeVisible();

      await page.getByRole("textbox", { name: "이름" }).fill("김젝트");
      await page.getByRole("textbox", { name: "휴대폰 번호" }).fill("01012345678");

      for (const label of ["지원자 신분", "거주 지역", "직무 관련 경험 기간"]) {
        await page.getByRole("combobox", { name: label }).click();
        await page.getByRole("option").first().click();
      }

      const interestedDomains = page.getByRole("combobox", { name: "관심 도메인" });
      await interestedDomains.click();
      await page.getByRole("option").first().click();
      await interestedDomains.press("Escape");

      await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();
      await page.getByRole("dialog").getByRole("button", { name: "등록하기" }).click();
    });

    await test.step("지원서 작성", async () => {
      await expect(page.getByRole("heading", { name: "지원서 작성" })).toBeVisible();

      for (const textbox of await page.getByRole("textbox").all()) {
        const isUrl = (await textbox.getAttribute("type")) === "url";

        await textbox.fill(isUrl ? "https://ject.kr" : "E2E 테스트 답변입니다.");
      }

      await page.getByRole("button", { name: "지원서 제출하기" }).click();
      await page.getByRole("dialog").getByRole("button", { name: "지원서 제출하기" }).click();
    });

    await expect(page.getByRole("heading", { name: "지원이 완료되었습니다" })).toBeVisible();
  });
});
