import { defineConfig, devices } from "@playwright/test";

// E2E_BASE_URL을 지정하면 해당 주소를 테스트한다. 기존 앱이나 Vercel 프리뷰를 대상으로
// 같은 스펙을 실행할 때 사용한다. 자세한 사용법은 docs/e2e-testing.md를 참고한다.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const startsOwnServer = !process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: startsOwnServer
    ? {
        // 로컬은 빠른 dev 서버, CI는 실제 프로덕션 빌드로 검증한다.
        command: process.env.CI ? "pnpm build && pnpm start" : "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
