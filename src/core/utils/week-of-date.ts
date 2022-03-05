import { DateTime } from 'luxon';

export function getWeekOfDate(date: DateTime): number {
  const firstWeekdayOfMonth = date.startOf('month').weekday;
  return Math.ceil((date.day + (firstWeekdayOfMonth - 1)) / 7);
}
