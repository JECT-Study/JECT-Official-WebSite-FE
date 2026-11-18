import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // 설정 파일에서는 .env가 process.env에 들어오지 않으므로 직접 읽는다.
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "VITE_");
  const apiBaseUrl = (env.VITE_API_URL ?? "").replace(/\/$/, "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      // 개발 환경에서 CORS를 피하기 위해 같은 오리진으로 요청한다. 운영에서는 앞단 프록시가
      // 같은 역할을 한다.
      proxy: apiBaseUrl
        ? {
            "/admin": { target: apiBaseUrl, changeOrigin: true },
            "/auth": { target: apiBaseUrl, changeOrigin: true },
          }
        : undefined,
    },
  };
});
