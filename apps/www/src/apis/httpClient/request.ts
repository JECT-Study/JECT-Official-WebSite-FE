import { REQUEST_TIMEOUT_MS } from "./constants";

export function fetchWithTimeout(request: Request, init?: RequestInit): Promise<Response> {
  return fetch(request, {
    ...init,
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
  });
}
