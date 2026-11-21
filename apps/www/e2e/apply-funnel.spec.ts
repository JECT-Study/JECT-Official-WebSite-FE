import { expect, type Page, test } from "@playwright/test";

import { getActiveRecruit, getActiveRecruitId, getActiveRecruits } from "./helpers/recruit";
import {
  registerTestbot,
  resetTestbot,
  saveTestbotProfile,
  saveTestbotTempAnswer,
  TESTBOT_AUTH_CODE,
  TESTBOT_EMAIL,
  TESTBOT_PIN,
} from "./helpers/testbot";

// 모든 테스트가 testbot 계정 하나를 초기화해 사용하므로 동시에 실행하지 않는다.
test.describe.configure({ mode: "serial" });

async function registerInFunnel(page: Page) {
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
}

test.describe("지원 퍼널", () => {
  test.beforeEach(async ({ request }) => {
    await resetTestbot(request);
  });

  test("지원자가 인증부터 지원서 제출까지 완료할 수 있다", async ({ page, request }) => {
    const recruitId = await getActiveRecruitId(request);

    await page.goto(`/apply/funnel/${recruitId}`);

    await registerInFunnel(page);

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

  test("다른 공고에 작성 중인 지원서가 있으면 지원할 수 없다고 안내한다", async ({
    page,
    request,
  }) => {
    const [inProgressRecruit, recruit] = await getActiveRecruits(request);
    expect(recruit, "모집 중인 공고가 두 개 이상 필요합니다.").toBeDefined();

    await registerTestbot(request, inProgressRecruit.recruitId);
    await saveTestbotProfile(request, inProgressRecruit.recruitId, inProgressRecruit.jobFamily);
    await saveTestbotTempAnswer(
      request,
      inProgressRecruit.recruitId,
      "다른 공고에 작성 중인 답변입니다."
    );

    await page.goto(`/apply/funnel/${recruit.recruitId}`);
    await registerInFunnel(page);

    await expect(
      page.getByRole("dialog").getByText("다른 공고에 지원한 내역이 있어요")
    ).toBeVisible();
  });
});

test.describe("이어서 작성하기", () => {
  test.beforeEach(async ({ request }) => {
    await resetTestbot(request);
  });

  test("프로필을 저장하기 전이면 프로필 작성 단계부터 이어서 작성한다", async ({
    page,
    request,
  }) => {
    const recruitId = await getActiveRecruitId(request);
    await registerTestbot(request, recruitId);

    await page.goto(`/apply/continue/${recruitId}`);
    await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
    await page.getByLabel("PIN", { exact: true }).fill(TESTBOT_PIN);
    await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();

    await expect(page.getByRole("heading", { name: "프로필 작성" })).toBeVisible();
  });

  test("임시 저장한 답변을 불러와 지원서 작성 단계부터 이어서 작성한다", async ({
    page,
    request,
  }) => {
    const answer = "이어서 작성하기 E2E 답변입니다.";
    const { recruitId, jobFamily } = await getActiveRecruit(request);
    await registerTestbot(request, recruitId);
    await saveTestbotProfile(request, recruitId, jobFamily);
    const question = await saveTestbotTempAnswer(request, recruitId, answer);

    await page.goto(`/apply/continue/${recruitId}`);
    await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
    await page.getByLabel("PIN", { exact: true }).fill(TESTBOT_PIN);
    await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();

    await expect(page.getByRole("heading", { name: "지원서 작성" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: question.title })).toHaveValue(answer);
  });

  test("PIN이 일치하지 않으면 오류 문구를 보여준다", async ({ page, request }) => {
    const recruitId = await getActiveRecruitId(request);
    await registerTestbot(request, recruitId);

    await page.goto(`/apply/continue/${recruitId}`);
    await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
    await page.getByLabel("PIN", { exact: true }).fill("000000");
    await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();

    await expect(page.getByText("이메일 혹은 PIN이 올바르지 않습니다.").first()).toBeVisible();
  });

  test("다른 공고에 작성 중인 지원서가 있으면 이어서 작성할 수 없다고 안내한다", async ({
    page,
    request,
    playwright,
  }) => {
    const [inProgressRecruit, recruit] = await getActiveRecruits(request);
    expect(recruit, "모집 중인 공고가 두 개 이상 필요합니다.").toBeDefined();

    await registerTestbot(request, recruit.recruitId);

    // 지원자가 공고마다 생성되어 인증 쿠키가 다르므로 다른 공고는 별도 요청 컨텍스트로 준비한다.
    const inProgressRequest = await playwright.request.newContext({
      baseURL: test.info().project.use.baseURL,
    });
    await registerTestbot(inProgressRequest, inProgressRecruit.recruitId);
    await saveTestbotProfile(
      inProgressRequest,
      inProgressRecruit.recruitId,
      inProgressRecruit.jobFamily
    );
    await saveTestbotTempAnswer(
      inProgressRequest,
      inProgressRecruit.recruitId,
      "다른 공고에 작성 중인 답변입니다."
    );
    await inProgressRequest.dispose();

    await page.goto(`/apply/continue/${recruit.recruitId}`);
    await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
    await page.getByLabel("PIN", { exact: true }).fill(TESTBOT_PIN);
    await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();

    await expect(
      page.getByRole("dialog").getByText("다른 공고에 지원한 내역이 있어요")
    ).toBeVisible();
  });
});

test.describe("PIN 재설정", () => {
  test.beforeEach(async ({ request }) => {
    await resetTestbot(request);
  });

  test("PIN을 재설정하면 새 PIN으로 본인 확인을 진행할 수 있다", async ({ page, request }) => {
    const newPin = "654321";
    const recruitId = await getActiveRecruitId(request);
    await registerTestbot(request, recruitId);

    await page.goto(`/apply/continue/${recruitId}`);
    await page.getByRole("link", { name: "PIN 번호를 잊어버리셨나요?" }).click();
    await expect(page.getByRole("heading", { name: "이메일 인증" })).toBeVisible();

    await test.step("이메일 인증", async () => {
      await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
      await page.getByRole("button", { name: "인증번호 받기" }).click();
      await page.getByRole("textbox", { name: "인증번호" }).fill(TESTBOT_AUTH_CODE);
      await page.getByRole("button", { name: "인증하기" }).click();

      await expect(page.getByText("인증에 성공했습니다.")).toBeVisible();
    });

    await test.step("새 PIN 설정", async () => {
      await page.getByLabel("새로운 PIN 설정").fill(newPin);
      await page.getByRole("button", { name: "PIN 재설정 완료하기" }).click();
    });

    await test.step("새 PIN으로 본인 확인", async () => {
      await expect(page.getByRole("heading", { name: "지원자 본인 확인" })).toBeVisible();

      await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
      await page.getByLabel("PIN", { exact: true }).fill(newPin);
      await page.getByRole("button", { name: "다음 단계로 진행하기" }).click();

      await expect(page.getByRole("heading", { name: "프로필 작성" })).toBeVisible();
    });
  });

  test("등록되지 않은 이메일로 PIN을 재설정하면 새 지원서 작성을 안내한다", async ({
    page,
    request,
  }) => {
    const recruitId = await getActiveRecruitId(request);

    await page.goto(`/apply/continue/${recruitId}`);
    await page.getByRole("link", { name: "PIN 번호를 잊어버리셨나요?" }).click();
    await expect(page.getByRole("heading", { name: "이메일 인증" })).toBeVisible();
    await page.getByRole("textbox", { name: "이메일" }).fill(TESTBOT_EMAIL);
    await page.getByRole("button", { name: "인증번호 받기" }).click();

    await expect(page.getByText("등록되지 않은 이메일 주소입니다.")).toBeVisible();
    await expect(page.getByRole("link", { name: "새로운 지원서를 작성할까요?" })).toHaveAttribute(
      "href",
      `/apply/funnel/${recruitId}`
    );
  });
});
