"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Motel, Reservation, Room, User } from "./types";
import {
  MOCK_MOTEL,
  MOCK_RESERVATIONS,
  MOCK_ROOMS,
  MOCK_USER,
} from "./mock-data";
import { hasOverlap } from "./overlap";

const STORAGE_KEY = "inntrack:v1";

type Persisted = {
  user: User;
  motel: Motel;
  rooms: Room[];
  reservations: Reservation[];
};

const INITIAL: Persisted = {
  user: MOCK_USER,
  motel: MOCK_MOTEL,
  rooms: MOCK_ROOMS,
  reservations: MOCK_RESERVATIONS,
};

export class OverlapError extends Error {
  constructor(public conflict: Reservation) {
    super(`Room is already booked for ${conflict.guestName}`);
    this.name = "OverlapError";
  }
}

type StoreApi = {
  hydrated: boolean;
  user: User;
  motel: Motel;
  rooms: Room[];
  reservations: Reservation[];
  // Motel
  updateMotelName: (name: string) => void;
  // Rooms
  createRoom: (input: Omit<Room, "id" | "motelId">) => Room;
  updateRoom: (id: string, patch: Partial<Omit<Room, "id" | "motelId">>) => void;
  deleteRoom: (id: string) => void;
  getRoom: (id: string) => Room | undefined;
  // Reservations
  createReservation: (
    input: Omit<Reservation, "id" | "createdAt">,
  ) => Reservation;
  updateReservation: (
    id: string,
    patch: Partial<Omit<Reservation, "id" | "createdAt">>,
  ) => void;
  deleteReservation: (id: string) => void;
  getReservation: (id: string) => Reservation | undefined;
  reservationsForRoom: (roomId: string) => Reservation[];
  // Utility
  resetToMocks: () => void;
};

const Ctx = createContext<StoreApi | null>(null);

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

function load(): Persisted {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      user: parsed.user ?? INITIAL.user,
      motel: parsed.motel ?? INITIAL.motel,
      rooms: parsed.rooms ?? INITIAL.rooms,
      reservations: parsed.reservations ?? INITIAL.reservations,
    };
  } catch {
    return INITIAL;
  }
}

function save(state: Persisted) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors in beta
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(state);
  }, [hydrated, state]);

  const updateMotelName = useCallback((name: string) => {
    setState((s) => ({ ...s, motel: { ...s.motel, name } }));
  }, []);

  const createRoom: StoreApi["createRoom"] = useCallback((input) => {
    const room: Room = { id: genId("room"), motelId: MOCK_MOTEL.id, ...input };
    setState((s) => ({ ...s, rooms: [...s.rooms, room] }));
    return room;
  }, []);

  const updateRoom: StoreApi["updateRoom"] = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      rooms: s.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const deleteRoom: StoreApi["deleteRoom"] = useCallback((id) => {
    setState((s) => ({
      ...s,
      rooms: s.rooms.filter((r) => r.id !== id),
      reservations: s.reservations.filter((r) => r.roomId !== id),
    }));
  }, []);

  const createReservation: StoreApi["createReservation"] = useCallback(
    (input) => {
      let created: Reservation | null = null;
      setState((s) => {
        const conflict = hasOverlap(
          s.reservations,
          input.roomId,
          input.checkIn,
          input.checkOut,
        );
        if (conflict && input.status !== "cancelled") {
          throw new OverlapError(conflict);
        }
        created = {
          id: genId("res"),
          createdAt: new Date().toISOString(),
          ...input,
        };
        return { ...s, reservations: [...s.reservations, created] };
      });
      return created!;
    },
    [],
  );

  const updateReservation: StoreApi["updateReservation"] = useCallback(
    (id, patch) => {
      setState((s) => {
        const current = s.reservations.find((r) => r.id === id);
        if (!current) return s;
        const next = { ...current, ...patch };
        const conflict = hasOverlap(
          s.reservations,
          next.roomId,
          next.checkIn,
          next.checkOut,
          id,
        );
        if (conflict && next.status !== "cancelled") {
          throw new OverlapError(conflict);
        }
        return {
          ...s,
          reservations: s.reservations.map((r) => (r.id === id ? next : r)),
        };
      });
    },
    [],
  );

  const deleteReservation: StoreApi["deleteReservation"] = useCallback((id) => {
    setState((s) => ({
      ...s,
      reservations: s.reservations.filter((r) => r.id !== id),
    }));
  }, []);

  const api = useMemo<StoreApi>(
    () => ({
      hydrated,
      user: state.user,
      motel: state.motel,
      rooms: state.rooms,
      reservations: state.reservations,
      updateMotelName,
      createRoom,
      updateRoom,
      deleteRoom,
      getRoom: (id) => state.rooms.find((r) => r.id === id),
      createReservation,
      updateReservation,
      deleteReservation,
      getReservation: (id) => state.reservations.find((r) => r.id === id),
      reservationsForRoom: (roomId) =>
        state.reservations.filter((r) => r.roomId === roomId),
      resetToMocks: () => setState(INITIAL),
    }),
    [
      hydrated,
      state,
      updateMotelName,
      createRoom,
      updateRoom,
      deleteRoom,
      createReservation,
      updateReservation,
      deleteReservation,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore(): StoreApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
