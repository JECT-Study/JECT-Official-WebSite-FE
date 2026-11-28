/**
 * 서버 스펙에서 Pageable이 쿼리 객체로 정의되어 있어 page, size를 각각의 쿼리 파라미터로 직렬화한다.
 * 서버의 Pageable에 @ParameterObject가 적용되면 제거하고 page, size를 직접 전달한다.
 */
export const pageableQuerySerializer = { object: { style: "form", explode: true } } as const;

/**
 * 서버 스펙에서 검색 조건이 쿼리 객체로 정의되어 있어 condition의 키를 각각의 쿼리 파라미터로 직렬화한다.
 * openapi-fetch의 form 방식은 객체 안의 배열을 직렬화하지 못해 직접 구현한다.
 * 서버의 검색 조건에 @ParameterObject가 적용되면 제거하고 조건을 직접 전달한다.
 */
export function conditionQuerySerializer<T extends object>({ condition }: { condition: T }) {
  const params = new URLSearchParams();

  Object.entries(condition).forEach(([key, value]) => {
    if (value === undefined) return;
    [value].flat().forEach((item) => params.append(key, String(item)));
  });

  return params.toString();
}
