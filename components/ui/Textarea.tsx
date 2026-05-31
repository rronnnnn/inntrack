"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, hint, error, className = "", id, ...rest },
  ref,
) {
  const tid = id ?? rest.name;
  return (
    <label htmlFor={tid} className="block">
      {label ? (
        <span className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </span>
      ) : null}
      <textarea
        id={tid}
        ref={ref}
        className={`w-full px-3 py-2 rounded-card bg-surface border-hair text-[15px] outline-none transition-colors min-h-[88px] ${
          error
            ? "border-status-cancelled focus:border-status-cancelled"
            : "border-line focus:border-accent-500"
        } ${className}`}
        {...rest}
      />
      {error ? (
        <span className="block text-xs text-status-cancelled mt-1">
          {error}
        </span>
      ) : hint ? (
        <span className="block text-xs text-ink-muted mt-1">{hint}</span>
      ) : null}
    </label>
  );
});
