import type { ErrorCode } from "@ject/api-types/errors";

import { ApiError } from "@/apis/httpClient/response";

export function hasErrorCode(error: unknown, code: ErrorCode): error is ApiError {
  return error instanceof ApiError && error.status === code;
}
