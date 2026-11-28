import { EmptyState } from "@jects/jds";

import { PAGE_TITLE } from "@/constants/pageTitle";
import { ROUTES } from "@/constants/routes";

export default function ErrorPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface-standard">
      <title>{PAGE_TITLE.error}</title>
      <EmptyState
        header="페이지를 불러오지 못했습니다"
        body="잠시 후 다시 시도해주세요."
        // 라우터가 에러 상태에 머물러 있으므로 문서를 새로 불러온다.
        primaryAction={{
          children: "홈으로 이동",
          onClick: () => window.location.assign(ROUTES.home),
        }}
      />
    </main>
  );
}
