"use client";

import { ServiceErrorState } from "@/components/error";

export default function ErrorPage() {
  return (
    <>
      <title>일시적인 오류 | 젝트</title>
      <ServiceErrorState />
    </>
  );
}
