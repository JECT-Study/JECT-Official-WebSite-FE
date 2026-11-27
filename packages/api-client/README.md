# @ject/api-client

openapi-fetch 기반 API 클라이언트입니다. `@ject/api-types`의 스펙 타입을 받아 경로, 파라미터,
요청 본문을 컴파일 단계에서 검사합니다.

## 사용

```ts
import { createApiClient } from "@ject/api-client";
import type { paths } from "@ject/api-types/core";

export const httpClient = createApiClient<paths>({
  baseUrl: "/api",
  credentials: "include",
});
```

```ts
const { data } = await httpClient.GET("/recruits/{recruitId}", {
  params: { path: { recruitId } },
});

return recruitSchema.parse(data);
```

`createApiClient`로 만든 클라이언트는 다음을 처리합니다.

- **타임아웃**: 요청이 30초 안에 끝나지 않으면 중단합니다.
- **공통 응답 형식**: 백엔드의 `{ status, data, timestamp }`에서 `data`만 꺼내 반환합니다.
  `status`가 `SUCCESS`가 아니면 `ApiError`를 던집니다.

응답 타입은 스펙을 따르지만 런타임 검증은 하지 않으므로, 반환값은 앱의 zod 스키마로
파싱합니다.

## 에러 처리

`ApiError`의 `status`는 서버의 에러 코드, `httpStatus`는 HTTP 상태 코드입니다. `detail`에는
실패 응답의 `data`가 담기며 화면에 그대로 노출하지 않습니다.

에러 코드 판별에는 `hasErrorCode`를 사용합니다. 코드는 `@ject/api-types/errors`의
`ErrorCode` 타입으로 검사합니다.

```ts
import { hasErrorCode } from "@ject/api-client";

if (hasErrorCode(error, "APPLY-3")) return null;
```

에러 코드별 처리는 이 패키지에 두지 않고 각 앱 `src/errors/`에 작성합니다. 두 앱이 공유하는
백엔드 인증 계약인 토큰 재발급만 `@ject/api-client/auth`가 처리합니다.

## 쿼리 직렬화

서버 스펙은 페이지 정보와 검색 조건을 `pageable`, `condition`이라는 객체 하나로 정의하지만,
서버는 객체 안의 값을 각각 별도의 쿼리 파라미터로 받습니다. openapi-fetch의 기본 직렬화로는
이 형식을 만들 수 없으므로 두 파라미터를 보낼 때는 `querySerializer`를 지정합니다.

- `pageableQuerySerializer`: `pageable` 객체의 `page`와 `size`를 각각 별도의 쿼리 파라미터로
  보냅니다.
- `conditionQuerySerializer`: `condition` 객체의 값을 각각 별도의 쿼리 파라미터로 보냅니다.
  값이 배열이면 항목마다 같은 이름의 파라미터를 반복합니다.

두 함수로 직렬화한 결과는 다음과 같습니다.

```ts
{ pageable: { page: 0, size: 10 } }
// page=0&size=10

{ condition: { recruitId: 1, selectionResults: ["PASSED", "FAILED"] } }
// recruitId=1&selectionResults=PASSED&selectionResults=FAILED
```

```ts
import { pageableQuerySerializer } from "@ject/api-client";

await httpClient.GET("/projects", {
  params: { query: { pageable: { page, size } } },
  querySerializer: pageableQuerySerializer,
});
```

서버에 `@ParameterObject`가 적용되면 두 함수를 제거하고 파라미터를 직접 전달합니다.

## 공용 스키마

서버 응답 형식에 공통으로 쓰는 zod 스키마는 `@ject/api-client/schemas`에서 가져옵니다.
zod는 peerDependency이므로 앱이 설치한 zod를 사용합니다.

- `localDateTimeSchema`: 시간대 표기가 없는 서버의 LocalDateTime 문자열을 검증합니다.

## 토큰 재발급

로그인이 필요한 앱은 `@ject/api-client/auth`의 `createRefreshMiddleware`를 추가합니다.

```ts
import { createRefreshMiddleware } from "@ject/api-client/auth";

httpClient.use(createRefreshMiddleware({ onRefreshFailure: handleRefreshFailure }));
```

- **재발급과 재시도**: 응답이 `GLOBAL-6`이면 `/auth/refresh`로 재발급을 요청하고, 원래 요청을
  한 번 다시 보냅니다.
- **동시 요청**: 여러 요청이 동시에 실패해도 재발급 요청은 한 번만 보내고 모두 같은 결과를
  기다립니다.
- **재발급 실패**: 요청이 `AUTH-3`, `AUTH-4`로 실패하거나 재발급 요청이 4xx 응답으로
  실패하면 `onRefreshFailure`를 호출합니다. 재발급 요청의 네트워크 오류나 5xx 응답은 다시
  로그인해도 해결되지 않는 상황이므로 콜백을 호출하지 않습니다.

  어느 경우든 원래 요청은 `ApiError`로 실패합니다. 로그인 화면으로 이동하는 등 앱마다 다른
  처리는 이 콜백에 작성하며, 콜백은 생략할 수 있습니다.

재발급은 브라우저가 쿠키를 갱신하는 방식이므로 브라우저에서 보내는 요청에만 추가합니다.

## 미들웨어 추가

앱에만 필요한 동작은 openapi-fetch 미들웨어로 작성해 `use()`로 추가합니다. 타입은 이
패키지에서 가져오므로 앱이 openapi-fetch에 직접 의존하지 않습니다.

```ts
import { createApiClient, type Middleware } from "@ject/api-client";

const forwardCookies: Middleware = {
  async onRequest({ request }) {
    // ...
    return request;
  },
};

httpClient.use(forwardCookies);
```

openapi-fetch는 `onResponse`를 등록한 역순으로 실행하기 때문에 앱에서 추가한 미들웨어의
`onResponse`는 공통 응답 처리보다 먼저 실행됩니다. 응답 본문은 `{ status, data, timestamp }`
형식이며, 실패 응답도 `ApiError`로 변환되기 전에 확인할 수 있습니다.
