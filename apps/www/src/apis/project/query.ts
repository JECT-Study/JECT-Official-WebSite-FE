import type { components } from "@ject/api-types/core";

const PAGE_SIZE = 6;

// TODO: 서버의 Pageable에 @ParameterObject가 적용되면 직렬화 설정을 제거하고 page, size를 쿼리로 직접 전달한다.
export const projectListQuerySerializer = { object: { style: "form", explode: true } } as const;

export function getProjectListQuery(category: string | null, page: number) {
  return {
    // 현황 API의 categoryName이 string으로 정의되어 있어 타입 단언을 사용한다.
    ...(category && { category: category as components["schemas"]["Category"] }),
    pageable: { page, size: PAGE_SIZE },
  };
}
