"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

export default function SettingsPage() {
  const router = useRouter();
  const { motel, user, updateMotelName, resetToMocks, hydrated } = useStore();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(motel.name);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) setName(motel.name);
  }, [hydrated, motel.name]);

  function saveName() {
    updateMotelName(name.trim() || "Untitled motel");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function onReset() {
    const ok = window.confirm(
      "Reset all rooms and reservations to the sample data?",
    );
    if (!ok) return;
    resetToMocks();
  }

  function onLogout() {
    router.push("/login");
  }

  return (
    <>
      <PageHeader title="Settings" />
      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-3">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
            Motel
          </p>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            onClick={saveName}
            disabled={!hydrated || name.trim() === motel.name}
          >
            {saved ? "Saved" : "Save"}
          </Button>
        </Card>

        <Card className="p-4 space-y-3">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
            Appearance
          </p>
          <div
            role="radiogroup"
            aria-label="Theme"
            className="flex rounded-card border-hair border-line p-1 bg-canvas"
          >
            {(["light", "dark"] as const).map((opt) => {
              const active = theme === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(opt)}
                  className={`flex-1 h-9 rounded-[8px] text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    active
                      ? "bg-surface text-ink shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {opt === "light" ? <SunIcon /> : <MoonIcon />}
                  <span className="capitalize">{opt}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
            Account
          </p>
          <Row label="Signed in as" value={user.email} />
          <div className="pt-2">
            <Button variant="secondary" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-2 opacity-70">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
            Subscription
          </p>
          <p className="text-sm">Free during beta.</p>
          <p className="text-xs text-ink-muted">
            Billing and plan management will be available before launch.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
            Data
          </p>
          <p className="text-xs text-ink-muted">
            Data is stored locally on this device for the beta.
          </p>
          <div className="pt-1">
            <Button variant="danger" size="sm" onClick={onReset}>
              Reset to sample data
            </Button>
          </div>
        </Card>

        <p className="text-center text-[11px] text-ink-subtle pt-2">
          InnTrack · beta build
        </p>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-ink-muted w-32 shrink-0">{label}</span>
      <span className="text-ink flex-1 min-w-0 break-words">{value}</span>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
