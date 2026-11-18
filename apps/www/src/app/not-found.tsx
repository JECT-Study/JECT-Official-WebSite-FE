import type { Metadata } from "next";

import { NotFoundState } from "@/components/error";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
};

export default function NotFound() {
  return <NotFoundState />;
}
