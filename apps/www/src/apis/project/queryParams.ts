import type { components } from "@ject/api-types/core";

const PAGE_SIZE = 6;

export function getProjectListQuery(category: string | null, page: number) {
  return {
    // 현황 API의 categoryName이 string으로 정의되어 있어 타입 단언을 사용한다.
    ...(category && { category: category as components["schemas"]["Category"] }),
    pageable: { page, size: PAGE_SIZE },
  };
}
