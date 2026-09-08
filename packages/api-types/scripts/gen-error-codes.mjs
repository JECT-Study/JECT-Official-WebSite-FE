import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = process.env.SERVER_REPO ?? "JECT-Study/JECT-Official-WebSite-Server";
const REF = process.env.SERVER_REF ?? "dev";

// Spring HttpStatus 상수를 숫자로 옮긴다. 목록에 없는 상수를 만나면 중단한다.
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// enum 항목은 `NAME(HTTP_STATUS, "코드", "메시지")` 형식이다.
const ENTRY =
  /^\s*([A-Z][A-Z0-9_]*)\s*\(\s*(?:HttpStatus\.)?([A-Z_]+)\s*,\s*"([^"]+)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)/gm;

const headers = { accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function listErrorCodeFiles() {
  const url = `https://api.github.com/repos/${REPO}/git/trees/${REF}?recursive=1`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`파일 목록을 받지 못했습니다 (${response.status}): ${url}`);
  }

  const { tree } = await response.json();

  return tree
    .map((node) => node.path)
    .filter((path) => path.endsWith("ErrorCode.java"))
    .sort();
}

async function readSource(path) {
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${path}를 받지 못했습니다 (${response.status})`);
  }

  return response.text();
}

function parse(source, path) {
  const entries = [];

  for (const [, name, httpStatus, code, message] of source.matchAll(ENTRY)) {
    if (!(httpStatus in HTTP_STATUS)) {
      throw new Error(`${path}의 ${name}에 모르는 HttpStatus가 있습니다: ${httpStatus}`);
    }

    entries.push({
      code: code.trim(),
      name,
      httpStatus: HTTP_STATUS[httpStatus],
      message: message.replace(/\\"/g, '"'),
    });
  }

  return entries;
}

const files = await listErrorCodeFiles();
const collected = new Map();

for (const path of files) {
  const source = await readSource(path);

  // 같은 이름 규칙을 쓰는 인터페이스가 있어 enum만 대상으로 삼는다.
  if (!/\benum\s+\w+/.test(source)) continue;

  const entries = parse(source, path);

  if (entries.length === 0) {
    throw new Error(`${path}에서 항목을 찾지 못했습니다. enum 작성 형식을 확인하세요.`);
  }

  for (const entry of entries) {
    const previous = collected.get(entry.code);

    if (previous) {
      throw new Error(`${entry.code}가 ${previous.name}과 ${entry.name}에 중복 정의되어 있습니다`);
    }

    collected.set(entry.code, entry);
  }

  process.stdout.write(`${path.split("/").pop()} ${entries.length}개\n`);
}

if (collected.size === 0) {
  throw new Error("에러 코드를 하나도 찾지 못했습니다. enum 형식이 바뀌었는지 확인하세요.");
}

const body = [...collected.values()]
  .map(
    ({ code, name, httpStatus, message }) =>
      `  ${JSON.stringify(code)}: { name: ${JSON.stringify(name)}, httpStatus: ${httpStatus}, message: ${JSON.stringify(message)} },`
  )
  .join("\n");

const output = `// ${REPO}의 *ErrorCode.java에서 생성한다. 직접 수정하지 않는다.
// 갱신은 \`pnpm gen:errors\`로 한다.

export const ERROR_CODES = {
${body}
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export function isErrorCode(value: string): value is ErrorCode {
  return value in ERROR_CODES;
}
`;

const target = resolve(dirname(fileURLToPath(import.meta.url)), "../src/errors.ts");
await writeFile(target, output);

process.stdout.write(`errors.ts 갱신 (${collected.size}개)\n`);
