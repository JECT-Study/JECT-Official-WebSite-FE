import "server-only";

import { cookies } from "next/headers";

import { createApiClient, type Middleware } from "@ject/api-client";
import type { paths } from "@ject/api-types/core";

import { SERVER_BASE_URL } from "./constants";

const forwardCookies: Middleware = {
  async onRequest({ request }) {
    if (request.credentials === "omit") return request;

    const cookieHeader = (await cookies()).toString();

    if (cookieHeader) {
      request.headers.set("cookie", cookieHeader);
    }

    return request;
  },
};

export const httpClient = createApiClient<paths>({ baseUrl: SERVER_BASE_URL });

httpClient.use(forwardCookies);
