# apps/www: 공식 홈페이지

젝트 공식 웹사이트입니다. Next.js 16 App Router를 사용합니다.
공통 컨벤션은 저장소 루트의 [AGENTS.md](../../AGENTS.md)를 따르며, 이 문서에는 이 앱에만
해당하는 규칙을 정리합니다.

## 명령

```bash
pnpm dev --filter=@ject/www      # 개발 서버 (http://localhost:3000)
pnpm build --filter=@ject/www
pnpm e2e --filter=@ject/www
```

앱 디렉토리 안에서는 필터 없이 실행할 수 있습니다.

## 디렉토리 구조

```
src/
├── app/              # Next App Router. 라우팅, 레이아웃, providers만 배치
├── components/       # 도메인별 컴포넌트 (apply, gnb, layout, common 등)
├── features/         # 퍼널 단위 기능 (apply. 스텝 컴포넌트 포함)
├── apis/             # httpClient, queryClient, 도메인별 api/schemas/queries
├── hooks/            # 폼, 쿼리, UI 공용 훅
├── stores/           # Zustand 스토어
├── errors/           # 에러 코드 판별 함수
├── constants/        # 경로, 외부 링크, 정적 페이지 데이터
├── assets/           # 이미지, SVG
├── styles/           # globals.css
└── utils/            # 포맷, 변환, 검증 등 공용 함수
e2e/                  # Playwright 스펙 (docs/e2e-testing.md 참고)
```

`src/app/`에는 화면 조립만 두고 실제 UI는 `components/`와 `features/`에 배치합니다.
라우트 세그먼트 폴더에 페이지 전용 컴포넌트를 두지 않습니다.

## 이 앱의 컨벤션

- **서버와 클라이언트 경계**: 기본은 서버 컴포넌트입니다. 브라우저 API에 의존하는 코드
  (Lenis, Amplitude, `window` 접근)는 `"use client"` 경계 뒤로 분리합니다. 경계는 페이지
  전체가 아니라 필요한 컴포넌트 단위로 좁힙니다.
- **서버 상태**: TanStack Query를 사용합니다. 클라이언트 생성은 `src/apis/queryClient.ts`의
  `getQueryClient()`를 통해서만 합니다.
- **API 프록시**: 브라우저 요청은 `/api/*`로 보냅니다. `next.config.ts`의 rewrite가
  `NEXT_PUBLIC_API_URL`로 전달하므로 같은 오리진이 되어 CORS와 쿠키 문제를 피합니다.
- **httpClient**: `src/apis/httpClient/`에 서버용과 클라이언트용을 나눠 둡니다. 서버용이
  `next/headers`의 `cookies()`를 가져오기 때문에 한 파일로 합칠 수 없습니다. 서버
  컴포넌트에서는 `@/apis/httpClient/server`를, 클라이언트 컴포넌트와 훅에서는
  `@/apis/httpClient/client`를 가져옵니다. 두 클라이언트 모두 `@ject/api-client`의
  `createApiClient`로 만들며, 타임아웃과 응답 처리는 이 패키지가 담당합니다. 토큰 재발급
  미들웨어는 클라이언트용에만 추가합니다. 서버 컴포넌트에서는 갱신된 쿠키를 응답에 설정할
  수 없습니다.
  `server.ts`는 `import "server-only"`로 클라이언트 번들 유입을 빌드 단계에서 막습니다.
- **서버에서 쿼리 정의 사용**: `queries.ts`의 `queryFn`은 클라이언트용 API를 사용합니다.
  따라서 서버 컴포넌트에서 prefetch할 때는 쿼리 정의를 펼친 뒤 `queryFn`만 `api.server.ts`의
  함수로 재정의합니다. 쿼리 키는 기존 정의를 그대로 사용하고, prefetch한 클라이언트를
  `dehydrate`해 `HydrationBoundary`로 전달하면 클라이언트가 같은 키로 해당 데이터를 사용합니다.
- **레이아웃 너비**: 본문 열 최대 너비는 `src/styles/globals.css`의 `@theme`에 두고
  `max-w-content`(922px), `max-w-narrow`(656px)로 씁니다. JDS 토큰이 아니라 이 앱의 값이므로
  여기서 정합니다. 페이지마다 `max-w-[922px]` 등을 다시 작성하지 않습니다.
- **페이지 레이아웃**: 본문 너비와 GNB 아래 여백은 라우트 그룹 레이아웃이 정합니다.
  `max-w-content` 페이지는 `app/(content)/`, `max-w-narrow` 페이지는 `app/(narrow)/` 아래에
  둡니다. 두 너비 중 하나의 단일 열로 구성되지 않는 페이지는 그룹 밖에 두고 페이지에서
  레이아웃을 정합니다. 그룹 안의 페이지와 feature에서는 너비나 GNB 높이 여백을 다시 지정하지
  않습니다. GNB 높이는 `globals.css`의 `--gnb-height`가 단일 출처입니다.
- **JDS와 서버 컴포넌트**: `Menu.Root`처럼 dot notation으로 사용하는 컴포넌트는 서버
  컴포넌트에서 사용할 수 없으므로, 서버 컴포넌트에서는 `MenuRoot` 같은 개별 export를
  사용합니다. 개별 export가 없는 컴포넌트와 `toastController` 같은 컴포넌트가 아닌 값은
  `"use client"` 파일 안에서 사용합니다. `@jects/jds/tokens`, `@jects/jds/utils`,
  `@jects/jds/theme`에서 가져온 값은 서버 컴포넌트에서도 사용할 수 있습니다.
- **SVG**: `import Icon from "@/assets/icon.svg"` 형태로 가져오면 React 컴포넌트입니다
  (`next.config.ts`의 turbopack svgr 규칙).
- **에러 처리**: 라우트 세그먼트 에러는 `src/app/error.tsx`에서, 루트 레이아웃까지 실패한
  경우는 `src/app/global-error.tsx`에서 처리합니다. 개별 컴포넌트에서 try-catch로 우회하지
  않습니다.
- **라우트 가드**: Next 16의 미들웨어 파일 이름은 `middleware.ts`가 아니라 `proxy.ts`이며,
  `src/`를 사용하므로 `src/proxy.ts`에 둡니다. 인증이 필요한 경로 제한을 여기에 작성합니다.

## 환경변수

브라우저에서 읽어야 하는 값에만 `NEXT_PUBLIC_` 접두사를 붙입니다. 이 접두사가 붙은 값은
코드에서 참조하지 않아도 클라이언트 번들에 포함되므로, 빌드 단계에서만 쓰는 값에는 붙이지
않습니다. Sentry 소스맵 업로드에 사용하는 `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`,
`SENTRY_PROJECT`가 해당합니다.

`.env.example`에는 코드가 실제로 참조하는 변수만 두고 값은 비워 커밋합니다. 실제 값은
`.env.local`에 두며 커밋하지 않습니다.

`NEXT_PUBLIC_` 값은 빌드 시점에 번들에 고정되므로, 값을 바꾸면 다시 빌드하고 배포해야
반영됩니다.

API 주소처럼 환경마다 다른 값은 변수를 나누지 않고, 값을 주입하는 쪽(로컬 `.env.local`, Vercel
프로젝트 설정, GitHub `production` Environment)에서 구분합니다.

## E2E 테스트

Playwright로 작성합니다. 테스트 범위, 셀렉터, 모킹, 독립성 규칙과 실패 분석 방법은
[docs/e2e-testing.md](./docs/e2e-testing.md)를 단일 출처로 따릅니다.

## 배포

- QA: Vercel. `dev`에 머지되면 `.github/workflows/qa-deploy-www.yml`이 배포합니다.
- 운영: AWS EC2. 릴리스 PR이 `main`에 머지되면 `.github/workflows/deploy-www.yml`이
  배포합니다. 레이블 없이 머지했거나 다시 배포해야 할 때는 Actions에서 수동으로 실행하며,
  `main`에서만 실행할 수 있습니다. `next.config.ts`의 `output: "standalone"`으로 빌드합니다.
  Vercel은 이 값을 무시하므로 QA 배포에는 영향이 없습니다.

서버 런타임이므로 SSR, route handler, 미들웨어를 사용할 수 있습니다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
