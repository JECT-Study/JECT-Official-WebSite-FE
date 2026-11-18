import createClient, { type ClientOptions } from "openapi-fetch";

import { fetchWithTimeout } from "./request";
import { unwrapApiResponse } from "./response";

export function createApiClient<Paths extends object>(options: Omit<ClientOptions, "fetch">) {
  const client = createClient<Paths>({ ...options, fetch: fetchWithTimeout });

  client.use(unwrapApiResponse);

  return client;
}
