export function parseDate(dateTime: string) {
  const [year, month, day] = dateTime.slice(0, 10).split("-").map(Number);

  return { year, month, day };
}
