import "server-only";

import { cookies } from "next/headers";

import type { z } from "zod";

import { SERVER_BASE_URL } from "./constants";
import { mergeHeaders, resolveBody, withTimeout } from "./request";
import { parseApiResponse } from "./response";

async function request<T>(
  endpoint: string,
  method: string,
  body?: unknown,
  schema?: z.ZodType<T>,
  options?: RequestInit
): Promise<T> {
  const resolved = resolveBody(body);
  const headers = mergeHeaders(resolved.contentType, options?.headers);

  // 서버 요청에는 쿠키가 자동으로 실리지 않는다.
  const cookieHeader = (await cookies()).toString();
  if (cookieHeader) headers.set("cookie", cookieHeader);

  const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
    ...options,
    method,
    headers,
    body: resolved.body,
    signal: withTimeout(options?.signal),
  });

  return parseApiResponse(response, schema);
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
