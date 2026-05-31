"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { monthName } from "@/lib/dates";

export function MonthSwitcher({
  year,
  monthIndex,
}: {
  year: number;
  monthIndex: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  function go(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const next = new URLSearchParams(sp);
    next.set("m", `${y}-${m}`);
    router.replace(`/calendar?${next.toString()}`);
  }

  function goToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const next = new URLSearchParams(sp);
    next.set("m", `${y}-${m}`);
    router.replace(`/calendar?${next.toString()}`);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous month"
        onClick={() => go(-1)}
        className="h-9 w-9 flex items-center justify-center rounded-full active:bg-canvas"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={goToday}
        className="h-9 px-2 text-sm font-medium min-w-[140px] text-center"
      >
        {monthName(monthIndex)} {year}
      </button>
      <button
        type="button"
        aria-label="Next month"
        onClick={() => go(1)}
        className="h-9 w-9 flex items-center justify-center rounded-full active:bg-canvas"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
