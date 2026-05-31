"use client";

import Link from "next/link";

export function FloatingButton({
  href,
  label = "Add",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+76px)] z-30 h-14 w-14 rounded-full bg-accent-500 text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
