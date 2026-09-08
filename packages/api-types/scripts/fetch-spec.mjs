import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SPEC_BASE_URL = process.env.SPEC_BASE_URL ?? "https://dev.api.ject.kr";

const GROUPS = [
  { name: "core", group: "Core API" },
  { name: "admin", group: "Admin API" },
];

const specsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../specs");

await mkdir(specsDir, { recursive: true });

for (const { name, group } of GROUPS) {
  const url = `${SPEC_BASE_URL}/v3/api-docs/${encodeURIComponent(group)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${group} 스펙을 받지 못했습니다 (${response.status}): ${url}`);
  }

  // 서버 응답의 키 순서와 무관하게 diff가 일정하도록 고정된 형식으로 저장한다.
  const spec = await response.json();
  await writeFile(resolve(specsDir, `${name}.json`), `${JSON.stringify(spec, null, 2)}\n`);

  process.stdout.write(`${name}.json 갱신\n`);
}
