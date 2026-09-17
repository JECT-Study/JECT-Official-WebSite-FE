import "@/styles/globals.css";

import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/footer";
import { GlobalNavigationBar } from "@/components/gnb";
import { THEME_STORAGE_KEY } from "@/constants/theme";

import { Providers } from "./providers";

// 하이드레이션 전에 테마를 적용해 첫 페인트 이후 색상이 바뀌는 것을 방지한다.
const THEME_SCRIPT = `
try {
  const stored = localStorage.getItem("${THEME_STORAGE_KEY}");
  const theme =
    stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.setAttribute("data-theme", theme);
} catch {
  document.documentElement.setAttribute("data-theme", "light");
}
`;

const SITE_NAME = "젝트";
const SITE_DESCRIPTION =
  "젝트(JECT)는 다양한 포지션 멤버들과 협업할 수 있는 IT 사이드 프로젝트 동아리예요. 홈페이지에서 더 자세한 내용을 확인해보세요!";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <GlobalNavigationBar />
          <main className="min-h-dvh bg-surface-standard">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
