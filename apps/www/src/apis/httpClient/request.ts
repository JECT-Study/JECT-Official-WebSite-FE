import { REQUEST_TIMEOUT_MS } from "./constants";

export function fetchWithTimeout(request: Request): Promise<Response> {
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]);

  return fetch(new Request(request, { signal }));
}
