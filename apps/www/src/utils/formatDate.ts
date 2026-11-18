const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseDate(dateTime: string) {
  const [year, month, day] = dateTime.slice(0, 10).split("-").map(Number);

  return { year, month, day };
}

export function formatDate(dateTime: string): string {
  const { year, month, day } = parseDate(dateTime);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${year}년 ${month}월 ${day}일(${weekday})`;
}
