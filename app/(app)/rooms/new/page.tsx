"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { RoomForm } from "@/components/rooms/RoomForm";

export default function NewRoomPage() {
  return (
    <>
      <PageHeader title="New room" back="/rooms" />
      <RoomForm />
    </>
  );
}
