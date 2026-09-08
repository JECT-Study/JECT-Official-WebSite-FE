import type { NextConfig } from "next";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // 운영은 EC2 자체 호스팅이라 standalone 번들이 필요하다. Vercel 프리뷰는 이 값을 무시한다.
  output: "standalone",

  // 기존 앱에서 react-router의 <Navigate replace />로 처리하던 경로다.
  async redirects() {
    return [
      { source: "/apply/verify", destination: "/apply", permanent: true },
      { source: "/apply/applicant-info", destination: "/apply", permanent: true },
      { source: "/apply/registration", destination: "/apply", permanent: true },
      { source: "/apply/complete", destination: "/apply", permanent: true },
    ];
  },

  // afterFiles 단계라 app/api에 route handler가 있으면 그쪽이 우선한다.
  async rewrites() {
    if (!apiBaseUrl) return [];

    return [{ source: "/api/:path*", destination: `${apiBaseUrl}/:path*` }];
  },

  // svg를 React 컴포넌트로 가져온다. 기존 앱의 `?react` 접미사는 사용하지 않는다.
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  { name: "preset-default", params: { overrides: { removeViewBox: false } } },
                  { name: "prefixIds" },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
