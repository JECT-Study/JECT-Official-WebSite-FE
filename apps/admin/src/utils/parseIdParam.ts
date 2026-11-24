/** URL 세그먼트가 10진수 양의 정수 형식인지 확인한 뒤 ID로 변환한다. Number()는 0x1, 1e3 같은 표기도 숫자로 변환하므로 형식을 먼저 검사한다. */
export function parseIdParam(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) ? id : null;
}
