# apps/www: 공식 홈페이지

젝트 공식 웹사이트입니다. Next.js 16 App Router를 사용합니다.
공통 컨벤션은 저장소 루트의 [AGENTS.md](../../AGENTS.md)를 따르며, 이 문서에는 이 앱에만
해당하는 규칙을 정리합니다.

기존 `JECT-Official-WebSite-Client`(Vite, react-router)를 이전하는 중입니다.

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
├── features/         # 퍼널 단위 기능 (apply, auth. 스텝 컴포넌트 포함)
├── apis/             # httpClient, queryClient, 도메인별 api/schemas/queryKeys
├── hooks/            # 폼, 쿼리, UI 공용 훅
├── stores/           # Zustand 스토어
├── errors/           # 에러 클래스와 매핑
├── constants/        # 경로, 엔드포인트, 정적 페이지 데이터
├── assets/           # 이미지, 아이콘, 로티
├── styles/           # globals.css
└── utils/            # 포맷, 변환, 검증 등 공용 함수
e2e/                  # Playwright 스펙 (docs/e2e-testing.md 참고)
```

`src/app/`에는 화면 조립만 두고 실제 UI는 `components/`와 `features/`에 배치합니다.
라우트 세그먼트 폴더에 페이지 전용 컴포넌트를 두지 않습니다.

## 이 앱의 컨벤션

- **서버와 클라이언트 경계**: 기본은 서버 컴포넌트입니다. 브라우저 API에 의존하는 코드
  (GSAP, Amplitude, Meta Pixel, `window` 접근, 디바이스 판별)는 `"use client"` 경계
  뒤로 분리합니다. 경계는 페이지 전체가 아니라 필요한 컴포넌트 단위로 좁힙니다.
- **서버 상태**: TanStack Query를 사용합니다. 클라이언트 생성은 `src/apis/queryClient.ts`의
  `getQueryClient()`를 통해서만 합니다.
- **API 프록시**: 브라우저 요청은 `/api/*`로 보냅니다. `next.config.ts`의 rewrite가
  `NEXT_PUBLIC_API_URL`로 전달하므로 같은 오리진이 되어 CORS와 쿠키 문제를 피합니다.
- **httpClient**: `src/apis/httpClient/`에 서버용과 클라이언트용을 나눠 둡니다. 서버용이
  `next/headers`의 `cookies()`를 가져오기 때문에 한 파일로 합칠 수 없습니다. 서버
  컴포넌트에서는 `@/apis/httpClient/server`를, 클라이언트 컴포넌트와 훅에서는
  `@/apis/httpClient/client`를 가져옵니다. 헤더 병합과 응답 처리는 같은 디렉토리의
  `request.ts`, `response.ts`를 양쪽이 공유합니다.
  `server.ts`는 `import "server-only"`로 클라이언트 번들 유입을 빌드 단계에서 막습니다.
- **SVG**: `import Icon from "@/assets/icon.svg"` 형태로 가져오면 React 컴포넌트입니다
  (`next.config.ts`의 turbopack svgr 규칙). 기존 앱의 `?react` 접미사는 사용하지 않으므로
  이전할 때 import 경로에서 제거합니다.
- **에러 처리**: 기존 앱의 에러 화면과 전역 핸들러를 이전할 때, 라우트 세그먼트 에러는
  `src/app/error.tsx`에서, 루트 레이아웃까지 실패한 경우는 `src/app/global-error.tsx`에서
  처리합니다. 개별 컴포넌트에서 try-catch로 우회하지 않습니다.
- **라우트 가드**: Next 16의 미들웨어 파일 이름은 `middleware.ts`가 아니라 앱 루트의
  `proxy.ts`입니다. 인증이 필요한 경로 제한을 여기에 작성합니다.

## 마이그레이션

기존 저장소는 이전이 끝날 때까지 레거시 유지보수용으로 운영됩니다.

1. **기능 동일성을 우선합니다.** 페이지를 옮기는 커밋에 동작 변경이나 리팩토링을 섞지
   않습니다. API 연동 변경과 하드코딩 제거는 이전이 끝난 다음 커밋에서 진행합니다.
   문제가 생겼을 때 커밋 하나를 되돌리는 것으로 원인을 구분할 수 있습니다.
2. **페이지 단위로 작업합니다.** 한 PR에 한 페이지 또는 한 레이아웃 그룹만 포함합니다.
3. **레거시 리다이렉트**는 `next.config.ts`의 `redirects`가 담당합니다.
4. **환경변수**는 아래 [환경변수](#환경변수) 절의 규칙을 따라 옮깁니다.
5. 페이지를 옮기면 `e2e/routes.ts`의 해당 항목을 `migrated: true`로 변경합니다.
6. 기존 저장소에 반영된 수정은 이 앱에도 옮깁니다. 분기 시점 이후 변경 내역을 주기적으로
   확인합니다.

## 환경변수

브라우저에서 읽어야 하는 값에만 `NEXT_PUBLIC_` 접두사를 붙입니다. 이 접두사가 붙은 값은
코드에서 참조하지 않아도 클라이언트 번들에 포함되므로, 빌드 단계에서만 쓰는 값에는 붙이지
않습니다. Sentry 소스맵 업로드에 사용하는 `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`,
`SENTRY_PROJECT`가 해당합니다.

`.env.example`에는 코드가 실제로 참조하는 변수만 두고 값은 비워 커밋합니다. 실제 값은
`.env.local`에 두며 커밋하지 않습니다.

기존 앱에서 옮길 때 이름만 바꾸지 않고 구조가 달라지는 항목입니다.

- API 주소는 `NEXT_PUBLIC_API_URL` 하나로 통합합니다. 기존 앱은 `VITE_API_URL_DEV`와
  `VITE_API_URL_PROD`를 두고 `src/constants/env.ts`에서 분기했으나, 환경 구분은 값을
  주입하는 쪽(로컬 `.env.local`, Vercel 프로젝트 설정, EC2)에서 처리합니다.
- GTM 컨테이너 ID는 `NEXT_PUBLIC_GTM_ID`로 분리합니다. 기존 앱은 `index.html`에 스니펫과
  ID를 직접 작성했으나 Next에는 해당 파일이 없습니다.
- 임시저장 암호화 키는 `NEXT_PUBLIC_SECRET_KEY`로 옮깁니다. 브라우저에서 복호화하므로
  접두사가 필요하며, localStorage에 평문을 남기지 않는 용도입니다.
- S3와 CloudFront 배포에 사용하던 AWS 변수는 옮기지 않습니다.

## E2E 테스트

Playwright로 작성합니다. 테스트 범위, 셀렉터, 모킹, 독립성 규칙과 실패 분석 방법은
[docs/e2e-testing.md](./docs/e2e-testing.md)를 단일 출처로 따릅니다.

## 배포

- QA: Vercel. `dev`에 머지되면 `.github/workflows/qa-deploy-www.yml`이 배포합니다.
- 운영: AWS EC2. `next.config.ts`의 `output: "standalone"`으로 빌드합니다. Vercel은 이 값을
  무시하므로 QA 배포에는 영향이 없습니다.

서버 런타임이므로 SSR, route handler, 미들웨어를 사용할 수 있습니다.
