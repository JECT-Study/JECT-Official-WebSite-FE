import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

// 두 앱이 공유하는 규칙이다. 프레임워크별 설정 뒤에 이어서 마지막에 적용한다.
export default [
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^node:"],
            ["^react\\u0000?$", "^react-dom(/|$|\\u0000)", "^next\\u0000?$", "^next/"],
            ["^@?\\w"],
            ["^@/"],
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-console": "error",
      "no-empty": ["error", { allowEmptyCatch: false }],
    },
  },
  prettier,
];
