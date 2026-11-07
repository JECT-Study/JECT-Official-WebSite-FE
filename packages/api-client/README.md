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

에러 코드별 처리는 이 패키지에 두지 않고 각 앱 `src/errors/`에 작성합니다. 코드는
`@ject/api-types/errors`의 `ErrorCode` 타입으로 좁혀 비교합니다.

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
