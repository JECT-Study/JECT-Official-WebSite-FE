import { EmptyState } from "@jects/jds";
import { useNavigate } from "react-router-dom";

import { PAGE_TITLE } from "@/constants/pageTitle";
import { ROUTES } from "@/constants/routes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <title>{PAGE_TITLE.notFound}</title>
      <EmptyState
        header="페이지를 찾을 수 없습니다"
        body="잘못된 주소를 입력했거나, 삭제된 페이지예요."
        primaryAction={{ children: "홈으로 이동", onClick: () => navigate(ROUTES.home) }}
      />
    </div>
  );
}
