import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { vars } from "@jects/jds/tokens";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// JDS는 브레이크포인트를 토큰으로 내보내지 않으므로 스타일시트의 미디어 쿼리에서 읽는다.
const BREAKPOINT_NAMES = ["mobile", "tablet", "desktop"];

function flatten(node, path = []) {
  if (typeof node === "string") return [[path.join("-"), node]];

  return Object.entries(node).flatMap(([key, value]) => flatten(value, [...path, key]));
}

function entry(name, value) {
  return `  ${name}: ${value};`;
}

function tokens(prefix, node) {
  return flatten(node).map(([path, value]) => entry(`${prefix}-${path}`, value));
}

async function readBreakpoints() {
  const source = await readFile(require.resolve("@jects/jds/styles"), "utf8");
  const bounds = new Set();

  for (const [, kind, width] of source.matchAll(/\((min|max)-width:\s*(\d+)px\)/g)) {
    bounds.add(kind === "min" ? Number(width) : Number(width) + 1);
  }

  const sorted = [...bounds].sort((a, b) => a - b);

  if (sorted.length !== BREAKPOINT_NAMES.length) {
    throw new Error(
      `브레이크포인트를 ${BREAKPOINT_NAMES.length}개로 기대했지만 ${sorted.length}개를 찾았습니다: ${sorted.join(", ")}`
    );
  }

  return BREAKPOINT_NAMES.map((name, index) => entry(`--breakpoint-${name}`, `${sorted[index]}px`));
}

function typography() {
  const { fontSize, font } = vars.typo.primitive;
  const lines = [entry("--text-*", "initial")];

  for (const [path, value] of flatten(fontSize)) {
    const lineHeight = flatten(font.lineHeight).find(([key]) => key === path)?.[1];
    const letterSpacing = flatten(font.letterSpacing).find(([key]) => key === path)?.[1];

    lines.push(entry(`--text-${path}`, value));
    if (lineHeight) lines.push(entry(`--text-${path}--line-height`, lineHeight));
    if (letterSpacing) lines.push(entry(`--text-${path}--letter-spacing`, letterSpacing));
  }

  return lines;
}

const groups = [
  [
    "색",
    [
      entry("--color-*", "initial"),
      entry("--color-transparent", "transparent"),
      entry("--color-current", "currentColor"),
      entry("--color-inherit", "inherit"),
      ...tokens("--color", vars.color.semantic),
    ],
  ],
  [
    "간격",
    [
      entry("--spacing", "initial"),
      entry("--spacing-*", "initial"),
      ...tokens("--spacing", vars.scheme.semantic.spacing),
      ...tokens("--spacing-margin", vars.scheme.semantic.margin),
    ],
  ],
  ["모서리", [entry("--radius-*", "initial"), ...tokens("--radius", vars.scheme.semantic.radius)]],
  ["타이포그래피", typography()],
  [
    "글꼴",
    [
      entry("--font-*", "initial"),
      ...tokens("--font", vars.typo.primitive.typeface),
      entry("--font-weight-*", "initial"),
      ...tokens("--font-weight", vars.typo.primitive.fontWeight),
    ],
  ],
  ["브레이크포인트", [entry("--breakpoint-*", "initial"), ...(await readBreakpoints())]],
  [
    "그림자와 전환",
    [
      entry("--shadow-*", "initial"),
      ...tokens("--shadow", vars.environment.semantic.shadow),
      entry("--ease-*", "initial"),
      ...tokens("--ease", vars.environment.semantic.motion),
      ...tokens("--duration", vars.environment.semantic.duration),
      ...tokens("--z-index", vars.environment.semantic.zIndex),
    ],
  ],
];

const body = groups.map(([label, lines]) => `  /* ${label} */\n${lines.join("\n")}`).join("\n\n");

const output = `/* @jects/jds의 토큰 계약에서 생성한다. 직접 수정하지 않는다. */
/* 갱신은 \`pnpm gen:theme\`으로 한다. */

@theme inline {
${body}
}
`;

await writeFile(resolve(here, "../theme.css"), output);

const count = output.match(/^\s{2}--/gm).length;
process.stdout.write(`theme.css 갱신 (${count}개)\n`);

// tailwind-merge는 JDS 토큰 이름을 모르므로 theme.css에 실제로 들어간 이름을 알려준다.
// 앞 항목부터 접두사를 비교하므로 font-weight를 font보다 먼저 둔다.
const TW_MERGE_NAMESPACES = [
  { prefix: "font-weight", theme: "font-weight" },
  { prefix: "font", theme: "font" },
  { prefix: "text", theme: "text" },
  { prefix: "radius", theme: "radius" },
  { prefix: "spacing", theme: "spacing" },
  { prefix: "shadow", theme: "shadow" },
  { prefix: "ease", theme: "ease" },
  { prefix: "breakpoint", theme: "breakpoint" },
  // tailwind-merge에 z-index 테마 키가 없어 z 클래스 그룹에 직접 추가한다.
  { prefix: "z-index", classGroup: "z" },
  // tailwind-merge가 color는 모든 값을, duration은 숫자를 기본으로 인식해 비워 둔다.
  // 지우면 twMergeConfigFrom이 에러를 던진다.
  { prefix: "color" },
  { prefix: "duration" },
];

function twMergeConfigFrom(css) {
  const theme = {};
  const classGroups = {};

  for (const [, name, value] of css.matchAll(/^\s*--([^:\s]+)\s*:\s*(.*?);?\s*$/gm)) {
    // `--spacing: initial` 같은 초기화 줄과 `--text-title-1--line-height` 같은 보조 변수는 클래스 이름이 아니다.
    if (value === "initial" || name.includes("--")) continue;

    const namespace = TW_MERGE_NAMESPACES.find(({ prefix }) => name.startsWith(`${prefix}-`));

    if (!namespace) {
      throw new Error(`tailwind-merge 설정에 대응하지 않는 네임스페이스입니다: --${name}`);
    }

    const token = name.slice(namespace.prefix.length + 1);

    if (namespace.theme) (theme[namespace.theme] ??= []).push(token);
    if (namespace.classGroup) (classGroups[namespace.classGroup] ??= []).push(token);
  }

  return {
    extend: {
      theme,
      classGroups: Object.fromEntries(
        Object.entries(classGroups).map(([group, tokens]) => [group, [{ [group]: tokens }]])
      ),
    },
  };
}

const twMergeConfig = twMergeConfigFrom(output);

await writeFile(resolve(here, "../tw-merge.json"), `${JSON.stringify(twMergeConfig, null, 2)}\n`);
process.stdout.write("tw-merge.json 갱신\n");
