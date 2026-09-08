import { expect, test } from "@playwright/test";

import { LEGACY_REDIRECTS } from "./routes";

test.describe("레거시 경로 리다이렉트", () => {
  for (const { from, to } of LEGACY_REDIRECTS) {
    test(`${from} 진입 시 ${to}로 이동한다`, async ({ page }) => {
      await page.goto(from);

      await expect(page).toHaveURL(new RegExp(`${to}/?$`));
    });
  }
});
