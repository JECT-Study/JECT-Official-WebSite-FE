/**
 * 서버 스펙에서 Pageable이 쿼리 객체로 정의되어 있어 page, size를 개별 쿼리로 펼쳐 직렬화한다.
 * 서버의 Pageable에 @ParameterObject가 적용되면 제거하고 page, size를 직접 전달한다.
 */
export const pageableQuerySerializer = { object: { style: "form", explode: true } } as const;
