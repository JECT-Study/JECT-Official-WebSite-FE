/**
 * 서버에 그대로 보내는 값. 기수나 모집 공고처럼 id로 거르는 필터는 숫자다.
 * 같은 필드 안에서 `1`과 `"1"`을 다른 옵션으로 두지 않는다. JDS 연동에서 둘을 구분하지 못한다.
 */
export type FilterOptionValue = string | number;

export interface FilterOption {
  value: FilterOptionValue;
  label: string;
}

export interface FilterField {
  /** 칩 순서가 `FilterValues`의 키 순서를 따르므로 `"1"`처럼 정수 형태의 문자열을 쓰지 않는다. */
  id: string;
  label: string;
  options: FilterOption[];
}

/**
 * 필터별로 선택한 옵션 값. 키가 있으면 칩을 표시하고, 빈 배열은 선택 없이 추가만 한 칩이다.
 * 서버 요청과 쿼리 키는 `normalizeFilterValues`로 정리한 뒤 빈 배열을 제외한 값으로 만든다.
 */
export type FilterValues = Record<string, FilterOptionValue[]>;
