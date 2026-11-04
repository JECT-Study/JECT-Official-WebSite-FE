import "server-only";

import { cookies } from "next/headers";

import type { paths } from "@ject/api-types/core";
import createClient, { type Middleware } from "openapi-fetch";

import { SERVER_BASE_URL } from "./constants";
import { fetchWithTimeout } from "./request";
import { unwrapApiResponse } from "./response";

const forwardCookies: Middleware = {
  async onRequest({ request }) {
    const cookieHeader = (await cookies()).toString();

    if (cookieHeader) {
      request.headers.set("cookie", cookieHeader);
    }

    return request;
  },
};

export const httpClient = createClient<paths>({
  baseUrl: SERVER_BASE_URL,
  fetch: fetchWithTimeout,
});

httpClient.use(forwardCookies, unwrapApiResponse);
