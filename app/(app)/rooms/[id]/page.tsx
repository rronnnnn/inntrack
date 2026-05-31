"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { useStore } from "@/lib/store";
import { ROOM_TYPE_LABEL } from "@/lib/types";
import { formatDate, nightsBetween } from "@/lib/dates";

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getRoom, reservationsForRoom, deleteRoom, hydrated } = useStore();

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Room" back="/rooms" />
        <p className="text-sm text-ink-muted text-center py-12">Loading…</p>
      </>
    );
  }

  const room = getRoom(params.id);
  if (!room) {
    return (
      <>
        <PageHeader title="Room" back="/rooms" />
        <div className="p-4">
          <Card className="p-6 text-center">
            <p className="text-ink-muted">Room not found.</p>
            <Link href="/rooms" className="text-accent-500 text-sm mt-3 inline-block">
              Back to rooms
            </Link>
          </Card>
        </div>
      </>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = reservationsForRoom(room.id)
    .filter((r) => new Date(r.checkOut) >= today)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  function onDelete() {
    if (!room) return;
    const ok = window.confirm(
      `Delete room ${room.number}? This also removes its reservations.`,
    );
    if (!ok) return;
    deleteRoom(room.id);
    router.push("/rooms");
  }

  return (
    <>
      <PageHeader title={`Room ${room.number}`} back="/rooms" />
      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-2">
          <Row label="Type" value={ROOM_TYPE_LABEL[room.type]} />
          <Row label="Bed configuration" value={room.bedConfig || "—"} />
          <Row label="Notes" value={room.notes || "—"} />
        </Card>

        <div className="flex gap-2">
          <Link href={`/rooms/${room.id}/edit`} className="flex-1">
            <Button variant="secondary" block>Edit</Button>
          </Link>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-ink-muted px-1 mb-2">
            Upcoming reservations
          </h2>
          {upcoming.length === 0 ? (
            <Card className="p-4 text-center text-sm text-ink-muted">
              No upcoming reservations.
            </Card>
          ) : (
            <div className="space-y-2">
              {upcoming.map((r) => {
                const nights = nightsBetween(r.checkIn, r.checkOut);
                return (
                  <Link
                    key={r.id}
                    href={`/reservations/${r.id}`}
                    className="block"
                  >
                    <Card className="p-3 active:bg-canvas">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{r.guestName}</p>
                          <p className="text-xs text-ink-muted">
                            {formatDate(r.checkIn)} → {formatDate(r.checkOut)} ·{" "}
                            {nights} night{nights === 1 ? "" : "s"} · {r.guestCount}{" "}
                            ppl
                          </p>
                        </div>
                        <StatusPill status={r.status} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-sm text-ink-muted w-36 shrink-0">{label}</span>
      <span className="text-sm text-ink flex-1 min-w-0 break-words">{value}</span>
    </div>
  );
}
