import base from "@ject/config/eslint/base";
import { defineConfig } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";

// eslint-config-next/core-web-vitals가 typescript-eslint, react, react-hooks,
// import, jsx-a11y 설정을 포함한다. 공유 규칙은 마지막에 적용한다.
export default defineConfig(
  {
    ignores: [".next", "out", "next-env.d.ts", "playwright-report", "test-results"],
  },
  ...next,
  ...base
);
