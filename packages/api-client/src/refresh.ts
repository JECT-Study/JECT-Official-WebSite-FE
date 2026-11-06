import type { ErrorCode } from "@ject/api-types/errors";
import type { Middleware } from "openapi-fetch";

import { fetchWithTimeout } from "./request";
import type { ApiResponse } from "./response";

const REFRESH_PATH = "/auth/refresh";

const REFRESH_REQUIRED_ERROR_CODES: ReadonlySet<string> = new Set<ErrorCode>(["GLOBAL-6"]);

const RELOGIN_REQUIRED_ERROR_CODES: ReadonlySet<string> = new Set<ErrorCode>(["AUTH-3", "AUTH-4"]);

export interface RefreshMiddlewareOptions {
  /** 토큰을 재발급할 수 없을 때 호출한다. 호출 후에도 요청은 `ApiError`로 실패한다. */
  onRefreshFailure?: () => void;
}

async function readStatus(response: Response) {
  try {
    const body = (await response.clone().json()) as ApiResponse<unknown>;

    return body.status;
  } catch {
    return undefined;
  }
}

async function readErrorCode(response: Response) {
  return response.ok ? undefined : readStatus(response);
}

async function requestRefresh(baseUrl = "") {
  try {
    return await fetchWithTimeout(
      new Request(`${baseUrl}${REFRESH_PATH}`, { method: "POST", credentials: "include" })
    );
  } catch {
    return undefined;
  }
}

export function createRefreshMiddleware({
  onRefreshFailure,
}: RefreshMiddlewareOptions = {}): Middleware {
  // 응답을 받은 뒤에는 요청 본문을 다시 읽을 수 없으므로, 재시도에 사용할 사본을 요청마다 보관한다.
  const requestCopies = new Map<string, Request>();
  let refreshing: Promise<Response | undefined> | null = null;

  // 여러 요청이 동시에 토큰 만료로 실패해도 재발급은 한 번만 요청하고 모두 같은 결과를 기다린다.
  function refresh(baseUrl?: string) {
    refreshing ??= requestRefresh(baseUrl).finally(() => {
      refreshing = null;
    });

    return refreshing;
  }

  return {
    onRequest({ request, id }) {
      requestCopies.set(id, request.clone());
    },

    async onResponse({ response, id, options }) {
      const requestCopy = requestCopies.get(id);
      requestCopies.delete(id);

      const code = await readErrorCode(response);

      if (code && RELOGIN_REQUIRED_ERROR_CODES.has(code)) {
        onRefreshFailure?.();
        return undefined;
      }

      if (!code || !REFRESH_REQUIRED_ERROR_CODES.has(code) || !requestCopy) {
        return undefined;
      }

      const refreshResponse = await refresh(options.baseUrl);

      if (!refreshResponse?.ok || (await readStatus(refreshResponse)) !== "SUCCESS") {
        onRefreshFailure?.();
        return refreshResponse?.clone();
      }

      const retried = await fetchWithTimeout(requestCopy);
      const retriedCode = await readErrorCode(retried);

      if (retriedCode && REFRESH_REQUIRED_ERROR_CODES.has(retriedCode)) {
        onRefreshFailure?.();
      }

      return retried;
    },

    onError({ id }) {
      requestCopies.delete(id);
    },
  };
}
