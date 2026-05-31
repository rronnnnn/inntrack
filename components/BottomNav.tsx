"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  match: (p: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
};

function IconCalendar({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <path
        d="M3.5 9.5h17M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round"
      />
      {active ? (
        <rect x="7" y="12.5" width="4" height="3" rx="0.5" fill="currentColor" />
      ) : null}
    </svg>
  );
}

function IconRooms({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
    </svg>
  );
}

function IconSettings({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <path
        d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2.6-1.5L14 2h-4l-.4 2.9a7.5 7.5 0 0 0-2.6 1.5l-2.4-.9-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-.9a7.5 7.5 0 0 0 2.6 1.5L10 22h4l.4-2.9a7.5 7.5 0 0 0 2.6-1.5l2.4.9 2-3.4-2-1.6z"
        stroke="currentColor"
        strokeWidth={active ? 1.8 : 1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TABS: Tab[] = [
  {
    href: "/calendar",
    label: "Calendar",
    match: (p) => p.startsWith("/calendar") || p.startsWith("/reservations"),
    icon: (a) => <IconCalendar active={a} />,
  },
  {
    href: "/rooms",
    label: "Rooms",
    match: (p) => p.startsWith("/rooms"),
    icon: (a) => <IconRooms active={a} />,
  },
  {
    href: "/settings",
    label: "Settings",
    match: (p) => p.startsWith("/settings"),
    icon: (a) => <IconSettings active={a} />,
  },
];

export function BottomNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-surface border-t border-hair border-line">
      <ul className="grid grid-cols-3 safe-bottom pt-1">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`flex flex-col items-center justify-center gap-0.5 h-14 ${
                  active ? "text-accent-500" : "text-ink-muted"
                }`}
              >
                {t.icon(active)}
                <span className="text-[11px] font-medium">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
