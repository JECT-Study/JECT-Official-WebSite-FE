import { REQUEST_TIMEOUT_MS } from "./constants";

function withTimeout(signal: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  // AbortSignal.any를 지원하지 않는 브라우저에서는 타임아웃만 적용한다.
  return typeof AbortSignal.any === "function" ? AbortSignal.any([signal, timeout]) : timeout;
}

export function fetchWithTimeout(request: Request, init?: RequestInit): Promise<Response> {
  return fetch(request, { ...init, signal: withTimeout(request.signal) });
}
