import { createApiClient } from "@ject/api-client";
import { createRefreshMiddleware } from "@ject/api-client/auth";
import type { paths } from "@ject/api-types/core";

import { CLIENT_BASE_URL } from "./constants";

export const httpClient = createApiClient<paths>({
  baseUrl: CLIENT_BASE_URL,
  credentials: "include",
});

httpClient.use(createRefreshMiddleware());
