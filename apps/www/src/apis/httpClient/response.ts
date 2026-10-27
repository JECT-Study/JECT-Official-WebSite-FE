import type { Middleware } from "openapi-fetch";

export interface ApiResponse<T> {
  status: string;
  data: T;
  timestamp?: string;
}

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

export const unwrapApiResponse: Middleware = {
  async onResponse({ response }) {
    if (response.status === 204) {
      return undefined;
    }

    const body = (await response.json()) as ApiResponse<unknown>;

    if (!response.ok || body.status !== "SUCCESS") {
      throw new ApiError(body.status ?? String(response.status), response.status, body.data);
    }

    return new Response(JSON.stringify(body.data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
