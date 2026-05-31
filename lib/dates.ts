/** Format Date or ISO string as DD.MM.YYYY */
export function formatDate(input: Date | string): string {
  const d = typeof input === "string" ? parseISODate(input) : input;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/** Format YYYY-MM-DD (for inputs / storage) */
export function toISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Parse YYYY-MM-DD as a local-time Date (avoids UTC shift bugs) */
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function startOfMonth(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function eachDayInMonth(year: number, monthIndex: number): Date[] {
  const n = daysInMonth(year, monthIndex);
  return Array.from({ length: n }, (_, i) => new Date(year, monthIndex, i + 1));
}

/** Nights between two ISO dates (checkOut is exclusive) */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseISODate(checkIn).getTime();
  const b = parseISODate(checkOut).getTime();
  return Math.max(0, Math.round((b - a) / 86400000));
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex];
}

/** Whether the given day (local Date) falls within [checkIn, checkOut). */
export function isDayInRange(
  day: Date,
  checkIn: string,
  checkOut: string,
): boolean {
  const t = day.getTime();
  const a = parseISODate(checkIn).getTime();
  const b = parseISODate(checkOut).getTime();
  return t >= a && t < b;
}

export function isSameYMD(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
