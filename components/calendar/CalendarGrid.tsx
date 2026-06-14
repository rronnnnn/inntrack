"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import {
  daysInMonth,
  eachDayInMonth,
  isSameYMD,
  parseISODate,
  toISODate,
} from "@/lib/dates";
import {
  checkoutOccupiesCheckoutDay,
  getCheckInOffset,
  getCheckOutOffset,
} from "@/lib/timeOffset";
import type { Reservation, ReservationStatus } from "@/lib/types";

const DAY_W = 56; // px per day column
const ROW_H = 56; // px per room row
const ROOM_W = 88; // px sticky label column

const BAR_COLORS: Record<ReservationStatus, string> = {
  confirmed: "bg-accent-500 text-white",
  pending: "bg-amber-500 text-white",
  cancelled: "bg-red-200 text-red-800 line-through opacity-70",
  checked_in: "bg-blue-500 text-white",
  checked_out: "bg-gray-400 text-white",
};

const DOW_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

type Bar = {
  res: Reservation;
  roomIndex: number;
  startCol: number; // 1-based grid column (within day columns)
  span: number;
  clippedLeft: boolean;
  clippedRight: boolean;
  /** % offset from left edge of first cell (0–100) */
  startPct: number;
  /** % offset from left edge of last cell (0–100) */
  endPct: number;
};

export function CalendarGrid({
  year,
  monthIndex,
}: {
  year: number;
  monthIndex: number;
}) {
  const { rooms, reservations, hydrated } = useStore();

  const sortedRooms = useMemo(
    () =>
      [...rooms].sort((a, b) =>
        a.number.localeCompare(b.number, undefined, { numeric: true }),
      ),
    [rooms],
  );

  const days = useMemo(
    () => eachDayInMonth(year, monthIndex),
    [year, monthIndex],
  );
  const nDays = daysInMonth(year, monthIndex);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const bars = useMemo<Bar[]>(() => {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEndExclusive = new Date(year, monthIndex + 1, 1);
    const out: Bar[] = [];
    for (const r of reservations) {
      const cin = parseISODate(r.checkIn);
      const cout = parseISODate(r.checkOut);
      const isSameDay = r.checkIn === r.checkOut;
      // A checkout time after 00:00 means the checkout day is partially
      // occupied, so the bar extends one extra (partial) cell onto that day.
      const checkoutPartial =
        !isSameDay && checkoutOccupiesCheckoutDay(r.checkOutTime);

      // Exclusive end of the day range the bar occupies:
      // - same-day: a single cell (the check-in day)
      // - partial checkout: through the checkout day inclusive → +1 day
      // - otherwise: checkout stays exclusive (last night only)
      const occupancyEndExclusive = isSameDay
        ? new Date(cin.getTime() + 86400000)
        : checkoutPartial
          ? new Date(cout.getTime() + 86400000)
          : cout;

      // Skip if outside this month
      if (occupancyEndExclusive <= monthStart || cin >= monthEndExclusive)
        continue;
      const startClipped = cin < monthStart;
      const endClipped = occupancyEndExclusive > monthEndExclusive;
      const start = startClipped ? monthStart : cin;
      const end = endClipped ? monthEndExclusive : occupancyEndExclusive;
      const startDay = start.getDate(); // 1..n
      const endDayExclusive =
        end.getMonth() === monthIndex ? end.getDate() : nDays + 1;
      const span = endDayExclusive - startDay;
      if (span <= 0) continue;
      const roomIndex = sortedRooms.findIndex((rm) => rm.id === r.roomId);
      if (roomIndex < 0) continue;

      const startPct = startClipped ? 0 : getCheckInOffset(r.checkInTime);
      // The last cell ends at the checkout offset only when that cell *is* the
      // (partial) checkout day; full intervening nights reach the right edge.
      const endPct =
        endClipped || !(isSameDay || checkoutPartial)
          ? 100
          : getCheckOutOffset(r.checkOutTime);

      out.push({
        res: r,
        roomIndex,
        startCol: startDay,
        span,
        clippedLeft: startClipped,
        clippedRight: endClipped,
        startPct,
        endPct,
      });
    }
    return out;
  }, [reservations, sortedRooms, year, monthIndex, nDays]);

  if (!hydrated) {
    return <p className="text-sm text-ink-muted text-center py-12">Loading…</p>;
  }

  if (sortedRooms.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-surface border-hair border-line rounded-card p-6 text-center">
          <p className="text-ink-muted text-sm">
            No rooms yet. Add a room to start scheduling reservations.
          </p>
          <Link
            href="/rooms/new"
            className="inline-block mt-3 text-accent-600 font-medium text-sm"
          >
            Add room →
          </Link>
        </div>
      </div>
    );
  }

  const gridWidth = ROOM_W + nDays * DAY_W;

  return (
    <div className="relative overflow-auto no-scrollbar bg-surface border-t border-b border-hair border-line">
      <div
        className="relative grid"
        style={{
          width: gridWidth,
          gridTemplateColumns: `${ROOM_W}px repeat(${nDays}, ${DAY_W}px)`,
          gridAutoRows: `${ROW_H}px`,
        }}
      >
        {/* Top-left sticky corner */}
        <div
          className="sticky top-0 left-0 z-30 bg-surface border-r border-b border-hair border-line"
          style={{ gridRow: 1, gridColumn: 1, height: ROW_H }}
        />

        {/* Day-number header (sticky top) */}
        {days.map((d, i) => {
          const isToday = isSameYMD(d, today);
          const dow = d.getDay();
          const weekend = dow === 0 || dow === 6;
          return (
            <div
              key={`hdr-${i}`}
              className={`sticky top-0 z-20 bg-surface border-b border-l border-hair border-line flex flex-col items-center justify-center ${
                weekend ? "text-ink-muted" : "text-ink"
              }`}
              style={{ gridRow: 1, gridColumn: i + 2 }}
            >
              <span className="text-[10px] uppercase tracking-wide">
                {DOW_SHORT[dow]}
              </span>
              <span
                className={`text-sm font-semibold leading-none mt-0.5 ${
                  isToday
                    ? "text-white bg-accent-500 rounded-full h-6 w-6 flex items-center justify-center"
                    : ""
                }`}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}

        {/* Room labels (sticky left) */}
        {sortedRooms.map((room, ri) => (
          <Link
            key={`room-${room.id}`}
            href={`/rooms/${room.id}`}
            className="sticky left-0 z-10 bg-surface border-r border-b border-hair border-line px-3 flex flex-col justify-center active:bg-canvas"
            style={{ gridRow: ri + 2, gridColumn: 1 }}
          >
            <span className="text-sm font-semibold">Room {room.number}</span>
            <span className="text-[11px] text-ink-muted truncate">
              {room.type}
            </span>
          </Link>
        ))}

        {/* Empty day cells (clickable to create reservation) */}
        {sortedRooms.map((room, ri) =>
          days.map((d, di) => {
            const isToday = isSameYMD(d, today);
            const dow = d.getDay();
            const weekend = dow === 0 || dow === 6;
            return (
              <Link
                key={`cell-${room.id}-${di}`}
                href={`/reservations/new?roomId=${room.id}&date=${toISODate(d)}`}
                aria-label={`Add reservation for Room ${room.number} on ${toISODate(d)}`}
                className={`border-l border-b border-hair border-line active:bg-accent-50 ${
                  isToday ? "bg-accent-50/40" : weekend ? "bg-canvas/60" : ""
                }`}
                style={{ gridRow: ri + 2, gridColumn: di + 2 }}
              />
            );
          }),
        )}

        {/* Reservation bars */}
        {bars.map((b) => {
          const nights =
            (parseISODate(b.res.checkOut).getTime() -
              parseISODate(b.res.checkIn).getTime()) /
            86400000;
          // Partial-day margin offsets:
          // marginLeft shifts start within first cell, marginRight trims end within last cell.
          // Base margin of 6px (m-1.5) is included in the offset so the bar stays within cell bounds.
          const BASE_MARGIN = 6; // px, matches m-1.5
          const marginLeft = b.clippedLeft
            ? BASE_MARGIN
            : (b.startPct / 100) * DAY_W;
          const marginRight = b.clippedRight
            ? BASE_MARGIN
            : ((100 - b.endPct) / 100) * DAY_W;
          return (
            <Link
              key={b.res.id}
              href={`/reservations/${b.res.id}`}
              className={`relative z-10 my-1.5 rounded-card px-2 flex items-center text-xs font-medium shadow-sm overflow-hidden ${BAR_COLORS[b.res.status]} ${
                b.clippedLeft ? "rounded-l-none" : ""
              } ${b.clippedRight ? "rounded-r-none" : ""}`}
              style={{
                gridRow: b.roomIndex + 2,
                gridColumn: `${b.startCol + 1} / span ${b.span}`,
                marginLeft,
                marginRight,
              }}
              title={`${b.res.guestName} · ${b.res.guestCount} ppl · ${nights} night${nights === 1 ? "" : "s"}`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate leading-tight">
                  {b.res.guestName}{" "}
                  <span className="opacity-80">· {b.res.guestCount} ppl</span>
                </div>
                {b.res.notes ? (
                  <div className="truncate text-[10px] opacity-80 leading-tight">
                    {b.res.notes}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
