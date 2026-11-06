import { createApiClient, createRefreshMiddleware } from "@ject/api-client";
import type { paths } from "@ject/api-types/admin";

import { handleAuthFailure } from "@/errors/auth";

export const httpClient = createApiClient<paths>({ baseUrl: "", credentials: "include" });

httpClient.use(createRefreshMiddleware({ onRefreshFailure: handleAuthFailure }));
