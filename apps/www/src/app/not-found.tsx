import type { Metadata } from "next";

import { NotFoundState } from "@/components/error";
import { createPageMetadata } from "@/constants/metadata";

export const metadata: Metadata = createPageMetadata({ title: "페이지를 찾을 수 없습니다" });

export default function NotFound() {
  return <NotFoundState />;
}
