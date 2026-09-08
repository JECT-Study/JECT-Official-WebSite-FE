# @ject/api-types

백엔드에서 생성한 TypeScript 타입입니다. 요청과 응답 타입은 OpenAPI 스펙에서, 에러 코드는
서버 저장소의 `*ErrorCode.java`에서 만듭니다.

## 사용

```ts
import type { components } from "@ject/api-types/core";

type Recruit = components["schemas"]["RecruitResponse"];
```

백오피스 스펙은 `@ject/api-types/admin`에서 가져옵니다.

에러 코드는 `@ject/api-types/errors`에서 가져옵니다. 코드를 키로 하고 코드명, HTTP 상태,
서버가 정의한 메시지를 값으로 가집니다.

```ts
import { ERROR_CODES, isErrorCode, type ErrorCode } from "@ject/api-types/errors";

ERROR_CODES["GLOBAL-6"]; // { name: "INVALID_ACCESS_TOKEN", httpStatus: 401, message: "..." }
```

코드 형식이 `DOMAIN-N`으로 통일되어 있지 않습니다. `EmailErrorCode`는 코드명을 코드로
그대로 사용하므로 형식을 가정한 파싱이나 분기를 작성하지 않습니다.

## 갱신

```bash
pnpm gen:api:fetch   # 서버에서 스펙을 받아 specs/ 갱신
pnpm gen:api         # specs/ 에서 src/ 타입 생성
pnpm gen:errors      # 서버 저장소에서 에러 코드를 읽어 src/errors.ts 생성
```

`src/`의 생성 결과물은 저장소에 커밋합니다. 빌드는 네트워크 없이 커밋된 파일만 읽습니다.

스펙 서버는 `https://dev.api.ject.kr`이며 `SPEC_BASE_URL`로 바꿀 수 있습니다. 에러 코드는
`JECT-Study/JECT-Official-WebSite-Server`의 `dev` 브랜치에서 읽으며 `SERVER_REPO`와
`SERVER_REF`로 바꿀 수 있습니다. `GITHUB_TOKEN`이 있으면 인증 요청으로 보냅니다.

## 검증

CI는 세 가지를 확인합니다.

- PR마다 `pnpm gen:api` 결과가 커밋된 `src/`와 일치하는지 검사합니다.
- 별도 워크플로가 주기적으로 서버 스펙을 받아 `specs/`와 차이가 있는지 확인합니다.
  차이가 있으면 백엔드 변경이 아직 반영되지 않은 것입니다.
- 같은 워크플로가 에러 코드도 다시 생성해 `src/errors.ts`와 비교합니다.

`gen:errors`는 저장소 트리 전체에서 `ErrorCode.java`로 끝나는 파일을 찾으므로 패키지
경로에는 의존하지 않습니다. 파일명 규칙과 `NAME(HttpStatus, "코드", "메시지")` 형식에
의존하며, enum 파일에서 항목을 찾지 못하거나 코드가 중복되면 실패합니다.
