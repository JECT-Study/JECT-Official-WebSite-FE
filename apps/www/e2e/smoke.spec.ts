import { expect, test } from "@playwright/test";

import { ROUTES } from "@/constants/routes";

const SMOKE_PATHS = [
  ROUTES.main,
  ROUTES.vision,
  ROUTES.curriculum,
  ROUTES.miniStudy,
  ROUTES.teamProject,
  ROUTES.faq,
  ROUTES.applyList,
];

test.describe("스모크 - 모든 경로가 에러 없이 렌더된다", () => {
  for (const path of SMOKE_PATHS) {
    test(path, async ({ page }) => {
      // 화면이 정상으로 보여도 렌더 중 예외가 발생한 경우를 검출한다.
      const pageErrors: Error[] = [];
      page.on("pageerror", (error) => pageErrors.push(error));

      const response = await page.goto(path);

      expect(response, "응답이 없습니다").not.toBeNull();
      expect(response!.status()).toBeLessThan(400);
      expect(
        pageErrors,
        `렌더 중 예외 발생: ${pageErrors.map((e) => e.message).join(", ")}`
      ).toHaveLength(0);
    });
  }
});

test("존재하지 않는 경로는 404 화면을 보여준다", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");

  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })).toBeVisible();
});
