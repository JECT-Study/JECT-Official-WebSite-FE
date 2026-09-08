# JECT-Official-WebSite-FE

젝트 메이커스 1팀에서 관리하는 공식 홈페이지 및 백오피스 애플리케이션을 포함한 모노레포입니다.

> [!IMPORTANT]
> 공식 홈페이지는 마이그레이션이 진행 중입니다. 현재 운영 중인 사이트는
> [JECT-Official-WebSite-Client](https://github.com/JECT-Study/JECT-Official-WebSite-Client)에서
> 관리하며, `apps/www`는 Next.js 마이그레이션을 위한 작업 공간입니다.

## 구성

| 워크스페이스         | 패키지            | 설명                          |
| -------------------- | ----------------- | ----------------------------- |
| `apps/www`           | `@ject/www`       | 공식 홈페이지 (Next.js 16)    |
| `apps/admin`         | `@ject/admin`     | 백오피스 (Vite SPA)           |
| `packages/config`    | `@ject/config`    | 공유 ESLint, tsconfig 설정    |
| `packages/api-types` | `@ject/api-types` | OpenAPI 스펙에서 생성한 타입  |
| `packages/styles`    | `@ject/styles`    | JDS 스타일 진입점과 테마 매핑 |

## 기술 스택

| 영역            | 도구                              |
| --------------- | --------------------------------- |
| 런타임          | mise (Node 22, pnpm 11)           |
| 모노레포        | pnpm workspaces, Turborepo        |
| 공식 홈페이지   | Next.js 16 (App Router), React 19 |
| 백오피스        | Vite 8, React 19, react-router 7  |
| 디자인 시스템   | JDS (`@jects/jds`)                |
| 스타일링        | Tailwind CSS v4                   |
| 서버 상태       | TanStack Query 5                  |
| 클라이언트 상태 | Zustand 5                         |
| 폼, 검증        | React Hook Form 7, Zod 4          |
| 린트, 포맷      | ESLint (flat config), Prettier 3  |
| E2E             | Playwright (`apps/www`)           |
| Git 훅          | lefthook                          |

## 사전 준비

Node와 pnpm 버전은 `mise.toml`에 고정되어 있습니다. mise를 설치하면 해당 버전이
자동으로 적용됩니다.

```bash
curl https://mise.run | sh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc && exec zsh
```

비대화형 환경에서는 `mise exec -- <command>` 형태로 실행합니다.

## 설치와 실행

```bash
mise install
pnpm install
pnpm dev
```

`pnpm dev`는 두 앱을 함께 실행합니다. 공식 홈페이지는 3000번, 백오피스는 5173번 포트를
사용합니다. 특정 앱만 실행하려면 필터를 지정합니다.

```bash
pnpm dev --filter=@ject/www
pnpm dev --filter=@ject/admin
```

E2E 실행 전에는 Playwright 브라우저를 설치합니다.

```bash
pnpm e2e:install
pnpm e2e --filter=@ject/www
```

## 스크립트

루트에서 실행하면 Turborepo가 각 워크스페이스로 전달합니다.

| 명령                 | 설명                            |
| -------------------- | ------------------------------- |
| `pnpm dev`           | 개발 서버 실행                  |
| `pnpm build`         | 프로덕션 빌드                   |
| `pnpm lint`          | ESLint 검사                     |
| `pnpm lint:fix`      | ESLint 자동 수정                |
| `pnpm typecheck`     | 타입 검사                       |
| `pnpm e2e`           | Playwright E2E 실행             |
| `pnpm e2e:install`   | Playwright 브라우저 설치        |
| `pnpm gen:api`       | 스냅샷에서 API 타입 생성        |
| `pnpm gen:api:fetch` | 서버에서 스펙 스냅샷 갱신       |
| `pnpm gen:errors`    | 서버 저장소에서 에러 코드 생성  |
| `pnpm gen:theme`     | JDS 토큰에서 Tailwind 테마 생성 |
| `pnpm format`        | Prettier 적용                   |
| `pnpm format:check`  | Prettier 검사 (수정 없음)       |
| `pnpm clean`         | 빌드 산출물 제거                |

## 문서

- [AGENTS.md](./AGENTS.md): 공통 컨벤션
- [apps/www/AGENTS.md](./apps/www/AGENTS.md): 공식 홈페이지
- [apps/admin/AGENTS.md](./apps/admin/AGENTS.md): 백오피스
- [apps/www/docs/e2e-testing.md](./apps/www/docs/e2e-testing.md): E2E 테스트
- [packages/api-types/README.md](./packages/api-types/README.md): API 타입과 에러 코드 생성
- [packages/styles/README.md](./packages/styles/README.md): 디자인 토큰과 Tailwind 매핑

## 배포

| 앱            | QA     | 운영               |
| ------------- | ------ | ------------------ |
| 공식 홈페이지 | Vercel | AWS EC2            |
| 백오피스      | Vercel | AWS S3, CloudFront |
