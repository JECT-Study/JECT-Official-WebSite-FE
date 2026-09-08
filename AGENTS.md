# AGENTS.md

젝트 메이커스 1팀 프론트엔드 저장소의 작업 가이드입니다. 두 앱이 공유하는 컨벤션을 정리하며,
앱별 규칙은 각 앱의 문서를 따릅니다.

- [apps/www/AGENTS.md](./apps/www/AGENTS.md): 공식 홈페이지 (Next.js)
- [apps/admin/AGENTS.md](./apps/admin/AGENTS.md): 백오피스 (Vite SPA)

> Claude Code는 [CLAUDE.md](./CLAUDE.md)에서 이 문서를 참조합니다. 공통 컨벤션이 바뀌면
> 이 파일을 단일 출처(source of truth)로 유지합니다.

## 구성

pnpm workspaces와 Turborepo 기반 모노레포입니다. Node와 pnpm 버전은 `mise.toml`에
고정되어 있습니다(Node 22, pnpm 11). 셸에 mise가 활성화되어 있지 않으면 모든 명령을
`mise exec -- pnpm <script>` 형태로 실행합니다.

```
apps/
├── www/            공식 홈페이지 (Next.js 16, App Router)
└── admin/          백오피스 (Vite SPA, react-router)
packages/
├── config/         ESLint, tsconfig 베이스
├── api-types/      OpenAPI 스펙에서 생성한 타입
└── styles/         JDS 스타일 진입점과 Tailwind 테마 매핑
```

디자인 시스템은 `@jects/jds` npm 패키지로 설치해 사용합니다. 컴포넌트는 앱에서 직접
가져오고, 토큰은 `@ject/styles`가 Tailwind 테마에 연결합니다.

## 명령

루트에서 실행하면 Turborepo가 각 워크스페이스로 전달합니다.

```bash
mise install                       # mise.toml에 고정된 Node/pnpm 설치
pnpm install                       # 의존성 설치 및 lefthook 훅 등록
pnpm dev                           # 두 앱 개발 서버 실행
pnpm build                         # 전체 빌드
pnpm lint                          # ESLint 검사
pnpm typecheck                     # 타입 검사
pnpm format                        # Prettier 적용 (루트에서만 실행)
pnpm gen:theme                     # JDS 토큰에서 Tailwind 테마 매핑 생성
```

특정 앱만 실행하려면 필터를 지정합니다.

```bash
pnpm dev --filter=@ject/www
pnpm build --filter=@ject/admin
pnpm e2e --filter=@ject/www
```

작업 완료를 보고하기 전에 `pnpm typecheck`와 `pnpm lint`를 실행해 통과를 확인합니다.
빌드에 영향이 있는 변경은 `pnpm build`까지 확인합니다. 실행 결과 없이 통과를 단정하지
않습니다.

## 공통 코드 컨벤션

- **언어**: TypeScript `strict` 모드를 사용합니다. `any` 대신 타입을 좁혀 사용합니다.
- **타입 선언**: 객체 형태는 `interface`를 기본으로 하고 확장은 `extends`로 합니다.
  `type`은 유니온, 튜플, 함수 시그니처 별칭, 매핑 타입과 조건부 타입처럼 `interface`로
  표현할 수 없는 경우에 사용합니다. `extends`는 관계 검사 결과가 캐시되고 프로퍼티 충돌을
  선언 시점에 에러로 알리지만, 인터섹션은 캐시되지 않으며 충돌해도 에러 없이 `never`가
  됩니다.
- **경로 alias**: `@/`는 각 앱의 `src/`를 가리킵니다. 상대경로 깊이가 2 이상이면 alias를
  사용합니다.
- **라우트 경로**: 각 앱 `src/constants/routes.ts`의 `ROUTES`와 `routeTo`가 단일 출처입니다.
  경로 문자열을 컴포넌트에 하드코딩하지 않습니다.
- **폼과 검증**: React Hook Form과 Zod를 사용합니다. Zod 스키마를 단일 출처로 두고
  `z.infer<typeof schema>`로 타입을 파생합니다.
- **API 계층**: 공용 클라이언트는 `src/apis/`의 `httpClient`이고, 도메인별 호출은
  `src/apis/<도메인>/`의 `api.ts`, `schemas.ts`, `queryKeys.ts`에 둡니다. 응답은 zod
  스키마로 파싱합니다. 쿼리 키는 계층형 팩토리(`xxxQueryKeys.all`에서 세분화)로 정의하고,
  훅 내부에 배열 키를 직접 작성하지 않습니다. `apps/www`는 서버용과 클라이언트용을 나눠
  두므로 해당 앱 문서를 함께 확인합니다.
- **공통 응답 형식**: 백엔드는 모든 응답을 `{ status, data, timestamp }`로 감쌉니다.
  `httpClient`가 `data`만 꺼내 반환하므로 도메인 코드와 zod 스키마는 바깥 형식을 다루지
  않습니다. `status`가 `SUCCESS`가 아니면 `ApiError`를 던집니다.
- **에러 코드**: 실패 응답의 `status`에 담기는 코드는 `@ject/api-types/errors`의
  `ERROR_CODES`가 단일 출처이며 서버 저장소에서 생성합니다. 코드 문자열을 직접
  작성하지 않고 `ErrorCode` 타입으로 좁혀 사용합니다. 코드별로 무엇을 할지는 공유하지
  않고 각 앱 `src/errors/`에 둡니다. 화면과 이동 경로가 앱마다 다릅니다.
- **API 타입**: 요청과 응답 타입은 `@ject/api-types`에서 가져옵니다. 손으로 정의하지
  않습니다. zod 스키마는 런타임 검증을 위해 직접 작성하되, 생성된 타입을 `z.ZodType`에
  지정해 스펙과 어긋나면 컴파일 단계에서 드러나게 합니다.

  ```ts
  import type { components } from "@ject/api-types/core";

  type RecruitResponse = components["schemas"]["RecruitResponse"];

  export const recruitSchema: z.ZodType<RecruitResponse> = z.object({
    // ...
  });
  ```

- **뮤테이션**: TanStack Query mutation과 `httpClient`를 사용합니다. Server Actions는
  MutationCache의 전역 에러 처리를 거치지 않으므로 사용하지 않습니다.
- **스타일**: Tailwind v4 유틸리티를 사용합니다. 전역 CSS는 각 앱
  `src/styles/globals.css`가 진입점이며 `@ject/styles`를 가져옵니다. 유틸리티는 JDS 토큰으로
  만들어지므로 `bg-surface-standard`, `p-16`, `text-body-md`처럼 씁니다. Tailwind 기본
  스케일(`bg-blue-500`, `p-5`, `rounded-lg`)은 생성되지 않습니다. 이름 규칙과 매핑하지 않는
  토큰은 [packages/styles/README.md](./packages/styles/README.md)를 따릅니다. 테마를 앱에서
  덧붙이지 않고 JDS에 반영한 뒤 `pnpm gen:theme`으로 갱신합니다. 조건부 클래스는
  `src/utils/cn.ts`의 `cn()`으로 조합합니다.
- **포맷**: Prettier가 세미콜론, 큰따옴표, printWidth 100을 강제합니다. Tailwind 클래스
  정렬은 `prettier-plugin-tailwindcss`가 처리하므로 직접 정렬하지 않고 `pnpm format`으로
  적용합니다. Prettier 설정은 루트 `.prettierrc` 하나입니다.
- **린트**: 공유 규칙은 `packages/config/eslint/base.js`에 있으며 각 앱이 프레임워크 설정
  뒤에 이어서 적용합니다. 특정 앱에만 필요한 규칙은 해당 앱의 `eslint.config.mjs`에
  작성합니다.
- **커밋 메시지**: `<type>: <한국어 한 줄 요약>` 형식입니다(예: `feat: FAQ 페이지 마이그레이션`).
- **문서와 주석**: 한국어로 작성합니다. 작성 규칙은 아래 절을 따릅니다.

## 주석과 문서

여기서 정한 규칙은 저장소에 남는 모든 글에 적용됩니다. 코드 주석, 설정 파일 주석
(`yaml`, `toml`, 셸 스크립트 포함), 마크다운 문서, 그리고 `AGENTS.md`와 `CLAUDE.md`,
`.claude/skills`처럼 에이전트가 읽는 문서가 모두 해당합니다.

### 문체

- **주석은 평서형 `~한다`로 고정합니다.** 파일 종류와 무관하게 같습니다.
- **문서(.md)는 `~합니다`체로 작성합니다.** 다만 `.claude/skills`처럼 에이전트에게 내리는
  지시문은 주석과 같은 평서형 `~한다`를 씁니다.
- **사용자에게 보이는 문자열은 `~합니다`체로 작성합니다.** 에러 메시지, CLI 출력,
  훅이 반환하는 안내문이 해당합니다. 주석과 구분합니다.
- 구어체 종결과 대화하듯 건네는 표현을 쓰지 않습니다.

### 표기

- **입력하기 어려운 기호를 쓰지 않습니다.** 가운뎃점, 대시, 화살표가 해당합니다. 나열은
  쉼표나 `/`로, 부연은 쌍점이나 괄호로 표기합니다.
- **다음 표현을 쓰지 않습니다.** 축, 배선, 박는다, 훑다, 돌리다, 굴러가다, 얹다,
  깔아두다. 각각 기준, 연동, 고정한다, 확인한다, 실행한다, 동작한다, 적용한다, 준비한다로
  바꿔 씁니다.
- 채택하지 않은 대안이나 팀 사정처럼 읽는 사람의 판단에 필요 없는 배경은 적지 않습니다.

### 주석의 분량과 대상

주석은 최소한으로 작성합니다. 동작 자체는 코드로 드러내고, 코드에서 확인할 수 없는
내용만 주석으로 남깁니다.

- **작성하는 경우**: 그렇게 구현한 이유가 코드에서 드러나지 않을 때, 실행 순서나
  우선순위처럼 코드 형태로 표현되지 않는 제약이 있을 때, 겉보기와 실제 동작이 다를 때.
- **작성하지 않는 경우**: 코드를 한국어로 옮겨 적은 설명, 이름만으로 알 수 있는 설명,
  변경 이력, 주석 처리한 코드. 컨벤션 설명은 주석이 아니라 이 문서에 작성합니다.
- **분량은 한 줄을 기본으로 합니다.** 세 줄을 넘으면 문서로 옮길 내용인지 검토합니다.
- **JSDoc/TSDoc은 타입 시그니처에 드러나지 않는 내용이 있을 때만** 작성합니다. 호출 순서
  제약, 부수 효과, 이름만으로 전달되지 않는 제네릭의 의미 등이 해당합니다. `@param`과
  `@returns`로 시그니처를 반복하지 않습니다.

```ts
// 작성한다. 호출 위치 제약이 타입에 드러나지 않는다.
/** Providers 안에서만 호출한다. 바깥에서 부르면 서버 요청 간 캐시가 섞인다. */
export function getQueryClient() {}

// 작성하지 않는다. 시그니처에 이미 드러난다.
export function cn(...inputs: ClassValue[]): string {}
```

## 브랜치

- `dev`: 통합 브랜치입니다. 작업 브랜치는 여기서 분기하고 PR도 여기로 보냅니다. 머지되면
  `.github/workflows/qa-deploy-*.yml`이 변경된 앱만 Vercel QA 사이트에 배포합니다.
- `main`: 운영 배포에 사용합니다. 배포 파이프라인을 만들기 전까지는 건드리지 않습니다.
- 작업 브랜치: `<type>/<이슈번호>-<이름>` 형식입니다(예: `feat/123-faq-migration`).
  type은 커밋 컨벤션의 prefix와 같은 집합을 씁니다.

`dev`와 `main`에 직접 커밋하지 않습니다.

## Pull Request

리뷰어가 한 번에 읽을 수 있는 크기로 만듭니다. PR이 커지면 리뷰가 늦어지고, 늦어진
리뷰가 다음 작업을 막는 병목이 됩니다.

올리기 전에 두 가지를 확인합니다.

- **목적이 하나인지**: 페이지 이전과 리팩토링, 기능 추가와 설정 변경처럼 성격이 다른
  작업이 섞여 있으면 나눕니다. 문제가 생겼을 때 어느 변경이 원인인지 구분할 수 있습니다.
- **분량이 적당한지**: `git diff dev...HEAD --stat`으로 확인합니다. 한 번에 읽기 버거운
  분량이면 나눕니다.

### Stacked PR

앞선 PR의 리뷰를 기다리는 동안 그 브랜치에서 다음 브랜치를 분기해 이어서 작업합니다.
PR을 작게 유지하면서 다음 작업을 시작할 수 있어 대기 시간이 줄어듭니다.

```bash
git switch -c feat/124-apply-form-validation feat/123-apply-form-layout
```

PR의 base는 `dev`가 아니라 앞선 브랜치로 지정합니다. 앞선 PR이 머지되고 브랜치가
삭제되면 GitHub가 뒤 PR의 base를 자동으로 옮깁니다. 앞선 PR에 리뷰 반영이 생기면 그
브랜치에서 고친 뒤 뒤 브랜치를 리베이스합니다.

CI는 base 브랜치를 제한하지 않으므로 중간 PR도 검사를 받습니다.

GitHub가 제공하는 stacked PR 기능은
[공식 문서](https://docs.github.com/ko/pull-requests/get-started/about-stacked-prs)를
참고합니다.

## Git 훅

`lefthook.yml`에 정의되어 있으며 `pnpm install` 시 자동 등록됩니다.

- **pre-commit**: staged 파일에 `eslint --fix`와 `prettier --write`를 적용하고 다시
  stage합니다.
- **pre-push**: 전체 타입 검사를 실행합니다.
- **post-checkout / post-merge / post-rewrite**: 브랜치 이동, 머지, 리베이스로
  `pnpm-lock.yaml`이 변경된 경우에만 `pnpm install`을 실행합니다.

훅을 우회해야 할 때는 `git <command> --no-verify`를 사용하되, 사유가 분명한 경우로
한정합니다.

## 의존성 빌드 승인

pnpm 11은 의존성의 install 스크립트를 기본 차단합니다. 빌드가 필요한 패키지는
`pnpm-workspace.yaml`의 `allowBuilds`에 추가합니다. package.json의 `pnpm` 필드가
아닙니다.
