import { ApiError } from "@ject/api-client";
import type { ErrorCode } from "@ject/api-types/errors";

export function hasErrorCode(error: unknown, code: ErrorCode): error is ApiError {
  return error instanceof ApiError && error.status === code;
}
