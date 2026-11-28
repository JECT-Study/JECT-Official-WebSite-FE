# apps/admin: 백오피스

젝트 운영을 위한 내부 백오피스 페이지입니다. Vite 기반 React SPA이며 react-router로 라우팅합니다.
공통 컨벤션은 저장소 루트의 [AGENTS.md](../../AGENTS.md)를 따르며, 이 문서에는 이 앱에만
해당하는 규칙을 정리합니다.

## 명령

```bash
pnpm dev --filter=@ject/admin      # 개발 서버 (http://localhost:5173)
pnpm build --filter=@ject/admin
```

앱 디렉토리 안에서는 필터 없이 실행할 수 있습니다.

## 디렉토리 구조

`apps/www`와 같은 이름을 사용합니다.

```
src/
├── pages/            # 라우트 단위 페이지
├── components/       # 도메인별 컴포넌트 (layout, common 등)
├── apis/             # httpClient, queryClient, 도메인별 api/schemas/queries
├── hooks/
├── stores/           # Zustand 스토어
├── constants/        # 경로, 엔드포인트 등 상수
├── styles/           # globals.css
├── utils/            # 포맷, 변환, 검증 등 공용 함수
├── router.tsx        # 라우트 트리
├── App.tsx           # Provider 조립
└── main.tsx          # 진입점
```

## 이 앱의 컨벤션

- **라우팅**: react-router v7의 `createBrowserRouter`를 `src/router.tsx`에 정의합니다.
  경로는 `src/constants/routes.ts`가 단일 출처입니다.
- **서버 상태**: TanStack Query를 사용합니다. 클라이언트는 `src/apis/queryClient.ts`의
  싱글턴을 사용합니다.
- **API**: 백오피스 API는 같은 출처의 상대 경로로 요청합니다. 관리 기능은 `/admin/*`,
  로그인과 로그아웃은 `/admin-auth/*`, 토큰 재발급은 `/auth/refresh`를 사용합니다.
- **접근성**: 키보드 조작과 포커스 관리는 지원합니다. 스크린리더 지원은 범위에서 제외하므로
  스크린리더용 이름과 안내문(`aria-label`, 라이브 리전 문구 등)은 따로 작성하지 않습니다.
- **검색 엔진 차단**: `index.html`의 `<meta name="robots" content="noindex, nofollow">`를
  제거하지 않습니다.

## 환경변수

`VITE_API_URL`은 개발 서버 프록시가 API 요청을 전달할 백엔드 주소이며, 로컬 값은 `.env.local`에
둡니다. `VITE_` 변수는 브라우저 번들에 포함될 수 있으므로 공개 가능한 값에만 사용합니다.

## 에러 처리

렌더링 에러는 루트 route의 `errorElement`가 `ErrorPage`로, 없는 경로는 `RootLayout` 안의
`*` route가 `NotFoundPage`로 표시합니다. 뮤테이션 실패는 `onError`에서
`showToast(TOAST_CONTENT.xxx)`로 알립니다. 에러 코드는 `@ject/api-client`의 `hasErrorCode`로
판별하고, 코드별 처리는 각 훅과 화면에서 합니다.

토큰 재발급은 `@ject/api-client/auth`의 미들웨어가 처리하고, 재발급에 실패했을 때의 로그아웃과
로그인 화면 이동은 `src/apis/httpClient.ts`의 `onRefreshFailure`에서 처리합니다.

## 배포

- QA: Vercel. `dev`에 머지되면 `.github/workflows/qa-deploy-admin.yml`이 배포합니다.
- 운영: AWS S3, CloudFront. `pnpm build`가 만드는 `dist/`를 올립니다.

정적 호스팅이므로 서버 런타임이 없습니다. CloudFront에서 404를 `/index.html`로 되돌려야
새로고침과 딥링크가 동작합니다.
