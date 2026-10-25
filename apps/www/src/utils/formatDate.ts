const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// 서버가 오프셋 없는 LocalDateTime을 보내므로 Date로 바꾸지 않고 날짜 부분만 읽는다.
function parseDate(dateTime: string) {
  const [year, month, day] = dateTime.slice(0, 10).split("-").map(Number);

  return { year, month, day };
}

export function formatDate(dateTime: string): string {
  const { year, month, day } = parseDate(dateTime);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${year}년 ${month}월 ${day}일(${weekday})`;
}
