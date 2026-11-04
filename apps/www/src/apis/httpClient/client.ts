import type { z } from "zod";

import { CLIENT_BASE_URL } from "./constants";
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

  const response = await fetch(`${CLIENT_BASE_URL}${endpoint}`, {
    ...options,
    method,
    credentials: "include",
    headers: mergeHeaders(resolved.contentType, options?.headers),
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
