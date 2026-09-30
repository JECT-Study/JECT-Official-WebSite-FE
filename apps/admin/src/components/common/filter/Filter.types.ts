/** 서버에 그대로 보내는 값. 기수나 모집 공고처럼 id로 거르는 필터는 숫자다. */
export type FilterOptionValue = string | number;

export interface FilterOption {
  value: FilterOptionValue;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  options: FilterOption[];
}

/**
 * 필터별로 선택한 옵션 값. 키가 있으면 칩을 표시하고, 빈 배열은 선택 없이 추가만 한 칩이다.
 * UI 상태이므로 서버 요청과 쿼리 키에는 빈 배열을 제외하고 전달한다.
 */
export type FilterValues = Record<string, FilterOptionValue[]>;
