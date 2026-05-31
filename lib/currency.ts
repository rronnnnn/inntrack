// Macedonian-style thousands separator: thin space (U+202F)
const THIN_SPACE = " ";

export function formatMKD(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded).toString();
  const withSep = abs.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
  return `${sign}${withSep} MKD`;
}

export function formatMoney(amount: number, currency: string): string {
  if (currency === "MKD") return formatMKD(amount);
  const rounded = Math.round(amount);
  const withSep = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
  return `${rounded < 0 ? "-" : ""}${withSep} ${currency}`;
}
