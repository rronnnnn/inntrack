"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@inntrack.app");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push("/calendar"), 300);
  }

  return (
    <main className="min-h-dvh flex flex-col bg-canvas">
      <div className="safe-top" />
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md w-full mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex h-14 w-14 rounded-card bg-accent-500 text-white items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold">InnTrack</h1>
          <p className="text-sm text-ink-muted mt-1">
            Reservations made simple
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Any value works in beta"
          />
          <Button type="submit" block size="lg" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-xs text-ink-muted text-center mt-6">
          No account? Contact your motel owner.
        </p>

        <div className="mt-10 p-3 rounded-card bg-accent-50 text-accent-700 text-xs text-center">
          Beta build — login is not enforced. You can browse the app directly.
        </div>
      </div>
    </main>
  );
}
