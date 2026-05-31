import type { ReservationStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";

const STYLES: Record<ReservationStatus, string> = {
  confirmed:
    "bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-200",
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  cancelled:
    "bg-red-50 text-red-700 line-through dark:bg-red-500/15 dark:text-red-200",
  checked_in:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
  checked_out:
    "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300",
};

export function StatusPill({
  status,
  className = "",
}: {
  status: ReservationStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STYLES[status]} ${className}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
