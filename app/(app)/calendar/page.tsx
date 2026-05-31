"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { MonthSwitcher } from "@/components/calendar/MonthSwitcher";
import { useStore } from "@/lib/store";

function parseMonthParam(m: string | null): { year: number; monthIndex: number } {
  if (m && /^\d{4}-\d{2}$/.test(m)) {
    const [y, mo] = m.split("-").map(Number);
    if (mo >= 1 && mo <= 12) return { year: y, monthIndex: mo - 1 };
  }
  const d = new Date();
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

export default function CalendarPage() {
  const sp = useSearchParams();
  const { motel } = useStore();
  const { year, monthIndex } = parseMonthParam(sp.get("m"));

  return (
    <>
      <PageHeader
        title={motel.name}
        right={<MonthSwitcher year={year} monthIndex={monthIndex} />}
      />
      <div className="py-2">
        <CalendarGrid year={year} monthIndex={monthIndex} />
      </div>
      <Legend />
      <FloatingButton href="/reservations/new" label="New reservation" />
    </>
  );
}

function Legend() {
  const items: { label: string; color: string }[] = [
    { label: "Confirmed", color: "bg-accent-500" },
    { label: "Pending", color: "bg-amber-500" },
    { label: "Checked in", color: "bg-blue-500" },
    { label: "Checked out", color: "bg-gray-400" },
    { label: "Cancelled", color: "bg-red-200" },
  ];
  return (
    <div className="px-4 py-3 flex flex-wrap gap-3">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${i.color}`} />
          <span className="text-[11px] text-ink-muted">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
