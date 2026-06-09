export type RoomType = "single" | "double" | "triple" | "suite";

export const ROOM_TYPES: RoomType[] = ["single", "double", "triple", "suite"];

export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  single: "Single",
  double: "Double",
  triple: "Triple",
  suite: "Suite",
};

export type ReservationStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "checked_in"
  | "checked_out";

export const RESERVATION_STATUSES: ReservationStatus[] = [
  "confirmed",
  "pending",
  "checked_in",
  "checked_out",
  "cancelled",
];

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  checked_in: "Checked in",
  checked_out: "Checked out",
};

export type User = {
  id: string;
  email: string;
  motelId: string;
};

export type Motel = {
  id: string;
  name: string;
  ownerId: string;
};

export type Room = {
  id: string;
  motelId: string;
  number: string;
  type: RoomType;
  bedConfig: string;
  notes: string;
};

export type Reservation = {
  id: string;
  roomId: string;
  guestName: string;
  guestCount: number;
  /** ISO date YYYY-MM-DD, inclusive */
  checkIn: string;
  /** HH:MM local time for check-in (optional, defaults to 00:00) */
  checkInTime?: string;
  /** ISO date YYYY-MM-DD, exclusive (day of departure) */
  checkOut: string;
  /** HH:MM local time for check-out (optional, defaults to 00:00) */
  checkOutTime?: string;
  status: ReservationStatus;
  pricePerNight: number;
  currency: string;
  notes: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
};
