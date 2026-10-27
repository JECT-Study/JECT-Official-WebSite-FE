import type { paths } from "@ject/api-types/core";
import createClient from "openapi-fetch";

import { CLIENT_BASE_URL } from "./constants";
import { fetchWithTimeout } from "./request";
import { unwrapApiResponse } from "./response";

export const httpClient = createClient<paths>({
  baseUrl: CLIENT_BASE_URL,
  credentials: "include",
  fetch: fetchWithTimeout,
});

httpClient.use(unwrapApiResponse);
