import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  back,
  right,
  subtitle,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-20 bg-canvas/90 backdrop-blur border-b border-hair border-line">
      <div className="safe-top" />
      <div className="h-14 px-4 flex items-center gap-2">
        {back ? (
          <Link
            href={back}
            aria-label="Back"
            className="-ml-2 h-10 w-10 flex items-center justify-center rounded-full active:bg-canvas"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        ) : null}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle ? (
            <p className="text-xs text-ink-muted truncate">{subtitle}</p>
          ) : null}
        </div>
        {right}
      </div>
    </header>
  );
}
