"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useStore } from "@/lib/store";
import { ROOM_TYPES, ROOM_TYPE_LABEL, type Room, type RoomType } from "@/lib/types";

type Props = { initial?: Room };

export function RoomForm({ initial }: Props) {
  const router = useRouter();
  const { createRoom, updateRoom } = useStore();

  const [number, setNumber] = useState(initial?.number ?? "");
  const [type, setType] = useState<RoomType>(initial?.type ?? "double");
  const [bedConfig, setBedConfig] = useState(initial?.bedConfig ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!number.trim()) {
      setError("Room number is required");
      return;
    }
    if (initial) {
      updateRoom(initial.id, {
        number: number.trim(),
        type,
        bedConfig: bedConfig.trim(),
        notes: notes.trim(),
      });
      router.push(`/rooms/${initial.id}`);
    } else {
      const r = createRoom({
        number: number.trim(),
        type,
        bedConfig: bedConfig.trim(),
        notes: notes.trim(),
      });
      router.push(`/rooms/${r.id}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
      <Input
        label="Room number"
        name="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="e.g. 101"
        error={error ?? undefined}
        required
      />
      <Select
        label="Type"
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value as RoomType)}
      >
        {ROOM_TYPES.map((t) => (
          <option key={t} value={t}>
            {ROOM_TYPE_LABEL[t]}
          </option>
        ))}
      </Select>
      <Input
        label="Bed configuration"
        name="bedConfig"
        value={bedConfig}
        onChange={(e) => setBedConfig(e.target.value)}
        placeholder="e.g. 1 queen + 1 sofa bed"
      />
      <Textarea
        label="Notes"
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes about this room"
      />
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="secondary" block onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" block>
          {initial ? "Save" : "Create room"}
        </Button>
      </div>
    </form>
  );
}
