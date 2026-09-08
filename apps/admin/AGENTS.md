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
├── apis/             # httpClient, queryClient, 도메인별 api/schemas/queryKeys
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
- **API**: 백오피스 엔드포인트는 `/admin/*` 접두사를 사용합니다. 개발 환경에서는
  `vite.config.ts`의 프록시가 `VITE_API_URL`로 전달합니다.
- **검색 엔진 차단**: `index.html`의 `<meta name="robots" content="noindex, nofollow">`를
  제거하지 않습니다.

## 배포

- QA: Vercel. `dev`에 머지되면 `.github/workflows/qa-deploy-admin.yml`이 배포합니다.
- 운영: AWS S3, CloudFront. `pnpm build`가 만드는 `dist/`를 올립니다.

정적 호스팅이므로 서버 런타임이 없습니다. CloudFront에서 404를 `/index.html`로 되돌려야
새로고침과 딥링크가 동작합니다.
