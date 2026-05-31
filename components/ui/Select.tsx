"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, hint, error, className = "", id, children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <label htmlFor={selectId} className="block">
      {label ? (
        <span className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </span>
      ) : null}
      <select
        id={selectId}
        ref={ref}
        className={`w-full h-11 px-3 rounded-card bg-surface border-hair text-[15px] outline-none appearance-none transition-colors bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236B7280%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5z%22/></svg>')] bg-no-repeat bg-[right_0.5rem_center] pr-9 ${
          error
            ? "border-status-cancelled focus:border-status-cancelled"
            : "border-line focus:border-accent-500"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
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
