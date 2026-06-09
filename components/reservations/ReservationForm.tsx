"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { useStore, OverlapError } from "@/lib/store";
import {
  RESERVATION_STATUSES,
  STATUS_LABEL,
  type Reservation,
  type ReservationStatus,
} from "@/lib/types";
import { addDays, formatDate, nightsBetween, parseISODate, toISODate } from "@/lib/dates";
import { formatMKD } from "@/lib/currency";

type Props = {
  initial?: Reservation;
  defaultRoomId?: string;
  defaultCheckIn?: string;
};

export function ReservationForm({ initial, defaultRoomId, defaultCheckIn }: Props) {
  const router = useRouter();
  const { rooms, createReservation, updateReservation } = useStore();

  const initialCheckIn =
    initial?.checkIn ?? defaultCheckIn ?? toISODate(new Date());
  const initialCheckOut =
    initial?.checkOut ?? toISODate(addDays(parseISODate(initialCheckIn), 1));

  const [roomId, setRoomId] = useState(
    initial?.roomId ?? defaultRoomId ?? rooms[0]?.id ?? "",
  );
  const [guestName, setGuestName] = useState(initial?.guestName ?? "");
  const [guestCount, setGuestCount] = useState(initial?.guestCount ?? 1);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkInTime, setCheckInTime] = useState(initial?.checkInTime ?? "14:00");
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [checkOutTime, setCheckOutTime] = useState(initial?.checkOutTime ?? "11:00");
  const [status, setStatus] = useState<ReservationStatus>(
    initial?.status ?? "confirmed",
  );
  const [pricePerNight, setPricePerNight] = useState(initial?.pricePerNight ?? 0);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = nights * (pricePerNight || 0);

  const sortedRooms = useMemo(
    () =>
      [...rooms].sort((a, b) =>
        a.number.localeCompare(b.number, undefined, { numeric: true }),
      ),
    [rooms],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!roomId) return setError("Pick a room");
    if (!guestName.trim()) return setError("Guest name is required");
    if (guestCount < 1) return setError("Guest count must be at least 1");
    if (nights < 1) return setError("Check-out must be after check-in");
    if (pricePerNight < 0) return setError("Price cannot be negative");

    const payload = {
      roomId,
      guestName: guestName.trim(),
      guestCount,
      checkIn,
      checkInTime: checkInTime || undefined,
      checkOut,
      checkOutTime: checkOutTime || undefined,
      status,
      pricePerNight,
      currency: initial?.currency ?? "MKD",
      notes: notes.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
    };

    try {
      if (initial) {
        updateReservation(initial.id, payload);
        router.push(`/reservations/${initial.id}`);
      } else {
        const created = createReservation(payload);
        router.push(`/reservations/${created.id}`);
      }
    } catch (err) {
      if (err instanceof OverlapError) {
        const room = rooms.find((r) => r.id === err.conflict.roomId);
        setError(
          `Room ${room?.number ?? ""} is already booked for ${err.conflict.guestName} (${formatDate(err.conflict.checkIn)} → ${formatDate(err.conflict.checkOut)}).`,
        );
      } else {
        setError("Could not save reservation.");
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
      <Select
        label="Room"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        required
      >
        {sortedRooms.length === 0 ? (
          <option value="">No rooms — add one first</option>
        ) : (
          sortedRooms.map((r) => (
            <option key={r.id} value={r.id}>
              Room {r.number}
            </option>
          ))
        )}
      </Select>

      <Input
        label="Guest name"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Full name"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Guests"
          type="number"
          inputMode="numeric"
          min={1}
          value={guestCount}
          onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ReservationStatus)}
        >
          {RESERVATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Check-in date"
          type="date"
          value={checkIn}
          onChange={(e) => {
            const v = e.target.value;
            setCheckIn(v);
            if (parseISODate(v) >= parseISODate(checkOut)) {
              setCheckOut(toISODate(addDays(parseISODate(v), 1)));
            }
          }}
          required
        />
        <Input
          label="Check-in time"
          type="time"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Check-out date"
          type="date"
          value={checkOut}
          min={toISODate(addDays(parseISODate(checkIn), 1))}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
        <Input
          label="Check-out time"
          type="time"
          value={checkOutTime}
          onChange={(e) => setCheckOutTime(e.target.value)}
        />
      </div>

      <Input
        label="Price per night (MKD)"
        type="number"
        inputMode="numeric"
        min={0}
        value={pricePerNight}
        onChange={(e) => setPricePerNight(Math.max(0, Number(e.target.value)))}
        placeholder="e.g. 2500"
      />

      <Card className="p-3 bg-canvas">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">
            {nights} night{nights === 1 ? "" : "s"} × {formatMKD(pricePerNight || 0)}
          </span>
          <span className="font-semibold">{formatMKD(total)}</span>
        </div>
      </Card>

      <Input
        label="Contact phone"
        type="tel"
        inputMode="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        placeholder="+389 …"
      />
      <Input
        label="Contact email"
        type="email"
        inputMode="email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        placeholder="guest@example.com"
      />

      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Anything to remember about this booking"
      />

      {error ? (
        <div className="p-3 rounded-card bg-red-50 text-status-cancelled text-sm">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="secondary" block onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" block>
          {initial ? "Save" : "Create reservation"}
        </Button>
      </div>
    </form>
  );
}
