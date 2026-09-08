import { REQUEST_TIMEOUT_MS } from "./constants";

export interface ResolvedBody {
  body: BodyInit | undefined;
  contentType: string | undefined;
}

// FormData는 브라우저가 boundary를 포함한 content-type을 직접 지정해야 한다.
export function resolveBody(body: unknown): ResolvedBody {
  if (body === undefined) {
    return { body: undefined, contentType: undefined };
  }

  if (body instanceof FormData || body instanceof Blob) {
    return { body, contentType: undefined };
  }

  return { body: JSON.stringify(body), contentType: "application/json" };
}

export function mergeHeaders(contentType: string | undefined, init?: HeadersInit): Headers {
  const headers = new Headers(init);

  if (contentType && !headers.has("content-type")) {
    headers.set("content-type", contentType);
  }

  return headers;
}

export function withTimeout(signal?: AbortSignal | null): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}
