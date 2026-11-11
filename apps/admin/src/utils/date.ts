export function parseDate(dateTime: string) {
  const [year, month, day] = dateTime.slice(0, 10).split("-").map(Number);

  return { year, month, day };
}

/** 서버 날짜는 오프셋 없는 한국 시각이므로 +09:00을 붙여 해석한다. */
export function parseKstDate(dateTime: string) {
  return new Date(`${dateTime}+09:00`);
}
