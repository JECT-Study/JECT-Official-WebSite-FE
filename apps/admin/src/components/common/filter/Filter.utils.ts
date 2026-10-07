import type { FilterField, FilterValues } from "./Filter.types";

/**
 * `fields`에 없는 필드와 옵션 값을 버린다. 옵션은 문자열로 비교해 정의된 원래 값을 반환한다.
 * 필드는 `values`의 키 순서(칩을 추가한 순서)를, 선택값은 옵션 정의 순서를 따르고 빈 배열은 유지한다.
 * 아직 받지 못한 옵션도 버리므로 `fields`는 옵션까지 준비된 뒤에 넘긴다.
 */
export function normalizeFilterValues(fields: FilterField[], values: FilterValues): FilterValues {
  return Object.fromEntries(
    Object.entries(values).flatMap(([fieldId, selected]) => {
      const field = fields.find((field) => field.id === fieldId);
      if (field === undefined) return [];

      const selectedValues = selected.map(String);

      return [
        [
          fieldId,
          field.options
            .filter((option) => selectedValues.includes(String(option.value)))
            .map((option) => option.value),
        ],
      ];
    })
  );
}
