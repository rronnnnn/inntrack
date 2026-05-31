"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, className = "", id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <label htmlFor={inputId} className="block">
      {label ? (
        <span className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        className={`w-full h-11 px-3 rounded-card bg-surface border-hair text-[15px] outline-none transition-colors ${
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
