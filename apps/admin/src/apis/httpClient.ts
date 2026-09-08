import type { z } from "zod";

const REQUEST_TIMEOUT_MS = 30_000;

export interface ApiResponse<T> {
  status: string;
  data: T;
  timestamp?: string;
}

/** 실패 응답은 `data`에 사람이 읽는 메시지가 담긴다. 화면에 그대로 노출하지 않는다. */
export class ApiError extends Error {
  readonly status: string;
  readonly httpStatus: number;
  readonly detail: unknown;

  constructor(status: string, httpStatus: number, detail: unknown) {
    super(`API 요청이 실패했습니다. (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.httpStatus = httpStatus;
    this.detail = detail;
  }
}

// FormData는 브라우저가 boundary를 포함한 content-type을 직접 지정해야 한다.
function resolveBody(body: unknown) {
  if (body === undefined) return { body: undefined, contentType: undefined };

  if (body instanceof FormData || body instanceof Blob) {
    return { body, contentType: undefined };
  }

  return { body: JSON.stringify(body), contentType: "application/json" };
}

async function request<T>(
  endpoint: string,
  method: string,
  body?: unknown,
  schema?: z.ZodType<T>,
  options?: RequestInit
): Promise<T> {
  const resolved = resolveBody(body);
  const headers = new Headers(options?.headers);

  if (resolved.contentType && !headers.has("content-type")) {
    headers.set("content-type", resolved.contentType);
  }

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  const response = await fetch(endpoint, {
    ...options,
    method,
    credentials: "include",
    headers,
    body: resolved.body,
    signal: options?.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
  });

  if (response.status === 204) return undefined as T;

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.status !== "SUCCESS") {
    throw new ApiError(payload.status ?? String(response.status), response.status, payload.data);
  }

  return schema ? schema.parse(payload.data) : payload.data;
}

export const httpClient = {
  get: <T>(endpoint: string, schema?: z.ZodType<T>, options?: RequestInit) =>
    request<T>(endpoint, "GET", undefined, schema, options),

  post: <T>(endpoint: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestInit) =>
    request<T>(endpoint, "POST", body, schema, options),

  put: <T>(endpoint: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestInit) =>
    request<T>(endpoint, "PUT", body, schema, options),

  patch: <T>(endpoint: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestInit) =>
    request<T>(endpoint, "PATCH", body, schema, options),

  delete: <T>(endpoint: string, schema?: z.ZodType<T>, options?: RequestInit) =>
    request<T>(endpoint, "DELETE", undefined, schema, options),
};
