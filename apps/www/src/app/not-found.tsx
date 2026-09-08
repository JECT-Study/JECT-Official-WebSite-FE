import Link from "next/link";

import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <Link href={ROUTES.main} className="text-sm underline">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
