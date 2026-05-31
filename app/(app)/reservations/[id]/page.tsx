"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { useStore, OverlapError } from "@/lib/store";
import {
  RESERVATION_STATUSES,
  STATUS_LABEL,
  type ReservationStatus,
} from "@/lib/types";
import { formatDate, nightsBetween } from "@/lib/dates";
import { formatMKD } from "@/lib/currency";
import { useState } from "react";

export default function ReservationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getReservation,
    getRoom,
    updateReservation,
    deleteReservation,
    hydrated,
  } = useStore();
  const [statusError, setStatusError] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Reservation" back="/calendar" />
        <p className="text-sm text-ink-muted text-center py-12">Loading…</p>
      </>
    );
  }

  const res = getReservation(params.id);
  if (!res) {
    return (
      <>
        <PageHeader title="Reservation" back="/calendar" />
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

  const room = getRoom(res.roomId);
  const nights = nightsBetween(res.checkIn, res.checkOut);
  const total = nights * res.pricePerNight;

  function onDelete() {
    if (!res) return;
    const ok = window.confirm(`Delete reservation for ${res.guestName}?`);
    if (!ok) return;
    deleteReservation(res.id);
    router.push("/calendar");
  }

  function onChangeStatus(next: ReservationStatus) {
    if (!res || next === res.status) return;
    setStatusError(null);
    try {
      updateReservation(res.id, { status: next });
    } catch (err) {
      if (err instanceof OverlapError) {
        setStatusError(
          `Cannot reactivate — overlaps with ${err.conflict.guestName}.`,
        );
      } else {
        setStatusError("Could not update status.");
      }
    }
  }

  return (
    <>
      <PageHeader title={res.guestName} back="/calendar" />
      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-muted">Status</span>
            <StatusPill status={res.status} />
          </div>

          <Row
            label="Room"
            value={
              room ? (
                <Link href={`/rooms/${room.id}`} className="text-accent-600 underline">
                  Room {room.number}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <Row label="Guests" value={`${res.guestCount}`} />
          <Row
            label="Dates"
            value={`${formatDate(res.checkIn)} → ${formatDate(res.checkOut)}`}
          />
          <Row label="Nights" value={`${nights}`} />
          <Row
            label="Price"
            value={`${formatMKD(res.pricePerNight)} / night`}
          />
          <Row label="Total" value={<strong>{formatMKD(total)}</strong>} />
        </Card>

        {(res.contactPhone || res.contactEmail) && (
          <Card className="p-4 space-y-3">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
              Contact
            </p>
            {res.contactPhone ? (
              <a
                href={`tel:${res.contactPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-accent-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{res.contactPhone}</span>
              </a>
            ) : null}
            {res.contactEmail ? (
              <a
                href={`mailto:${res.contactEmail}`}
                className="flex items-center gap-3 text-accent-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3 7l9 6 9-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="truncate">{res.contactEmail}</span>
              </a>
            ) : null}
          </Card>
        )}

        {res.notes ? (
          <Card className="p-4">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="text-sm whitespace-pre-wrap">{res.notes}</p>
          </Card>
        ) : null}

        <Card className="p-4">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
            Change status
          </p>
          <div className="flex flex-wrap gap-2">
            {RESERVATION_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeStatus(s)}
                className={`px-3 h-9 rounded-card text-sm border-hair transition-colors ${
                  res.status === s
                    ? "bg-accent-500 text-white border-accent-500"
                    : "bg-surface border-line text-ink hover:bg-canvas"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          {statusError ? (
            <p className="text-xs text-status-cancelled mt-2">{statusError}</p>
          ) : null}
        </Card>

        <div className="flex gap-2">
          <Link href={`/reservations/${res.id}/edit`} className="flex-1">
            <Button variant="secondary" block>Edit</Button>
          </Link>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-sm text-ink-muted w-28 shrink-0">{label}</span>
      <span className="text-sm text-ink flex-1 min-w-0 break-words">{value}</span>
    </div>
  );
}
