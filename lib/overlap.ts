import type { Reservation } from "./types";
import { parseISODate } from "./dates";

/**
 * Half-open interval overlap: [aIn, aOut) overlaps [bIn, bOut)
 * iff aIn < bOut && bIn < aOut.
 * Back-to-back same-day handovers (A.out == B.in) do NOT overlap.
 *
 * Cancelled reservations are ignored — they free up the room.
 */
export function hasOverlap(
  reservations: Reservation[],
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeId?: string,
): Reservation | null {
  const aIn = parseISODate(checkIn).getTime();
  const aOut = parseISODate(checkOut).getTime();
  for (const r of reservations) {
    if (r.roomId !== roomId) continue;
    if (excludeId && r.id === excludeId) continue;
    if (r.status === "cancelled") continue;
    const bIn = parseISODate(r.checkIn).getTime();
    const bOut = parseISODate(r.checkOut).getTime();
    if (aIn < bOut && bIn < aOut) return r;
  }
  return null;
}
