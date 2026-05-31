"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { RoomForm } from "@/components/rooms/RoomForm";
import { useStore } from "@/lib/store";

export default function EditRoomPage() {
  const params = useParams<{ id: string }>();
  const { getRoom, hydrated } = useStore();

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Edit room" back={`/rooms/${params.id}`} />
        <p className="text-sm text-ink-muted text-center py-12">Loading…</p>
      </>
    );
  }

  const room = getRoom(params.id);
  if (!room) {
    return (
      <>
        <PageHeader title="Edit room" back="/rooms" />
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

  return (
    <>
      <PageHeader title={`Edit room ${room.number}`} back={`/rooms/${room.id}`} />
      <RoomForm initial={room} />
    </>
  );
}
