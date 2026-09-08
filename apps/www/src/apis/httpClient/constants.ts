const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

// 브라우저는 next.config.ts의 rewrite를 거쳐 같은 오리진으로 요청한다.
export const CLIENT_BASE_URL = "/api";

export const SERVER_BASE_URL = apiOrigin;

export const REQUEST_TIMEOUT_MS = 30_000;
