/**
 * Helpers for partial-day reservation rendering.
 *
 * Each calendar day cell represents 00:00–23:59.
 * Horizontal position = percentage of the cell width.
 *
 * Set USE_TIME_BUCKETS = true for visually simplified bucket-based rendering.
 */

export const USE_TIME_BUCKETS = false;

/**
 * Parse "HH:MM" → minutes since midnight.
 * Returns 0 for missing/invalid input.
 */
function parseMinutes(time: string | undefined): number {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return Math.min(h, 23) * 60 + Math.min(m, 59);
}

/** Percentage (0–100) where a check-in time falls within a day cell. */
export function getCheckInOffset(time: string | undefined): number {
  if (USE_TIME_BUCKETS) {
    const mins = parseMinutes(time);
    if (mins < 10 * 60) return 0;   // 00:00–09:59 → left edge
    if (mins < 18 * 60) return 50;  // 10:00–17:59 → middle
    return 90;                       // 18:00–23:59 → near right
  }
  return (parseMinutes(time) / 1440) * 100;
}

/**
 * Whether a checkout time means the checkout day itself is partially occupied.
 * True when a time is given and it falls after 00:00 — in that case the bar
 * should extend one extra (partial) cell onto the checkout day. A missing time
 * or an exact 00:00 checkout occupies no part of the checkout day.
 */
export function checkoutOccupiesCheckoutDay(time: string | undefined): boolean {
  return parseMinutes(time) > 0;
}

/** Percentage (0–100) where a check-out time falls within a day cell. */
export function getCheckOutOffset(time: string | undefined): number {
  if (USE_TIME_BUCKETS) {
    const mins = parseMinutes(time);
    if (mins < 10 * 60) return 10;  // 00:00–09:59 → near left
    if (mins < 18 * 60) return 50;  // 10:00–17:59 → middle
    return 100;                      // 18:00–23:59 → right edge
  }
  const mins = parseMinutes(time);
  // Treat 00:00 checkout as end-of-previous-day (100% of prior cell)
  if (mins === 0 && time !== undefined) return 100;
  return (mins / 1440) * 100;
}
