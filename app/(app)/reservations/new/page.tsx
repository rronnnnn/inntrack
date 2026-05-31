"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReservationForm } from "@/components/reservations/ReservationForm";

function NewReservationPageInner() {
  const sp = useSearchParams();
  const roomId = sp.get("roomId") ?? undefined;
  const date = sp.get("date") ?? undefined;

  return (
    <>
      <PageHeader title="New reservation" back="/calendar" />
      <ReservationForm defaultRoomId={roomId} defaultCheckIn={date} />
    </>
  );
}

export default function NewReservationPage() {
  return (
    <Suspense fallback={null}>
      <NewReservationPageInner />
    </Suspense>
  );
}
