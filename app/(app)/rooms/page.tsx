"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { useStore } from "@/lib/store";
import { ROOM_TYPE_LABEL } from "@/lib/types";

export default function RoomsListPage() {
  const { rooms, hydrated, reservations } = useStore();

  const sorted = [...rooms].sort((a, b) =>
    a.number.localeCompare(b.number, undefined, { numeric: true }),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <PageHeader
        title="Rooms"
        subtitle={hydrated ? `${rooms.length} total` : undefined}
      />
      <div className="p-4 space-y-2">
        {!hydrated ? (
          <p className="text-sm text-ink-muted text-center py-12">Loading…</p>
        ) : sorted.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-ink-muted text-sm">
              No rooms yet. Tap + to add your first one.
            </p>
          </Card>
        ) : (
          sorted.map((r) => {
            const activeCount = reservations.filter(
              (res) =>
                res.roomId === r.id &&
                res.status !== "cancelled" &&
                new Date(res.checkOut) >= today,
            ).length;
            return (
              <Link key={r.id} href={`/rooms/${r.id}`} className="block">
                <Card className="p-4 active:bg-canvas">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-base">Room {r.number}</p>
                      <p className="text-sm text-ink-muted truncate">
                        {ROOM_TYPE_LABEL[r.type]}
                        {r.bedConfig ? ` · ${r.bedConfig}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-ink-muted">Upcoming</p>
                      <p className="text-sm font-medium">{activeCount}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
      <FloatingButton href="/rooms/new" label="Add room" />
    </>
  );
}
