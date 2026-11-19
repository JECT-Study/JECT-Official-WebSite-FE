"use client";

import "@/styles/globals.css";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";

import { ServiceErrorState } from "@/components/error";
import { restoreTheme } from "@/hooks/useTheme";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

// 루트 레이아웃을 대체하므로 GNB와 푸터 없이 html과 body를 직접 렌더링한다.
export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    restoreTheme();
  }, []);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="bg-surface-standard">
        <title>일시적인 오류 | 젝트</title>
        <ServiceErrorState />
      </body>
    </html>
  );
}
