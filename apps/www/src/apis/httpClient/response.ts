import type { z } from "zod";

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

export async function parseApiResponse<T>(response: Response, schema?: z.ZodType<T>): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || body.status !== "SUCCESS") {
    throw new ApiError(body.status ?? String(response.status), response.status, body.data);
  }

  return schema ? schema.parse(body.data) : body.data;
}
