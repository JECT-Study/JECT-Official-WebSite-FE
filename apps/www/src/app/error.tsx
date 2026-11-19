"use client";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";

import { ServiceErrorState } from "@/components/error";

interface ErrorPageProps {
  error: Error & { digest?: string };
}

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <>
      <title>일시적인 오류 | 젝트</title>
      <ServiceErrorState />
    </>
  );
}
