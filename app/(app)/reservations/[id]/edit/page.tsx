"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { useStore } from "@/lib/store";

export default function EditReservationPage() {
  const params = useParams<{ id: string }>();
  const { getReservation, hydrated } = useStore();

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Edit reservation" back={`/reservations/${params.id}`} />
        <p className="text-sm text-ink-muted text-center py-12">Loading…</p>
      </>
    );
  }

  const res = getReservation(params.id);
  if (!res) {
    return (
      <>
        <PageHeader title="Edit reservation" back="/calendar" />
        <div className="p-4">
          <Card className="p-6 text-center">
            <p className="text-ink-muted">Reservation not found.</p>
            <Link href="/calendar" className="text-accent-500 text-sm mt-3 inline-block">
              Back to calendar
            </Link>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Edit reservation" back={`/reservations/${res.id}`} />
      <ReservationForm initial={res} />
    </>
  );
}
