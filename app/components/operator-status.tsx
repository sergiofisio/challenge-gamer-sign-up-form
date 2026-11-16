import { cn } from "@/lib/cn";
import type { OperatorFault } from "@/lib/validation";

export interface OperatorRow {
  key: string;
  label: string;
  status: OperatorFault;
}

interface OperatorStatusProps {
  callsignDisplay: string;
  readyCount: number;
  rows: OperatorRow[];
  provisioned?: boolean;
  compact?: boolean;
}

function statusClass(status: OperatorFault, provisioned: boolean) {
  if (provisioned || status === "LOCKED") return "text-neutral-600";
  if (status === "OK") return "text-neutral-100";
  if (
    status === "PENDING" ||
    status === "REQUIRED" ||
    status === "MISSING"
  ) {
    return "text-neutral-500";
  }
  return "text-red-400";
}

export default function OperatorStatus({
  callsignDisplay,
  readyCount,
  rows,
  provisioned = false,
  compact = false,
}: OperatorStatusProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4 border-y border-neutral-800 py-3">
        <p className="font-jetbrains-mono text-xs uppercase tracking-[0.16em] text-neutral-500">
          Operator ID
        </p>
        <p
          className={cn(
            "font-jetbrains-mono text-xs uppercase tracking-[0.16em]",
            callsignDisplay === "Unassigned"
              ? "text-neutral-500"
              : "text-neutral-100",
          )}
        >
          {callsignDisplay}
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Operator ID status" className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4 border-b border-neutral-800 pb-3">
        <p className="font-jetbrains-mono text-xs uppercase tracking-[0.16em] text-neutral-500">
          Operator ID
        </p>
        <p
          className={cn(
            "font-jetbrains-mono text-xs font-bold uppercase tracking-[0.16em]",
            provisioned || readyCount === 5
              ? "text-lime-500"
              : "text-neutral-500",
          )}
        >
          {provisioned ? "Provisioned" : `${readyCount}/5 ready`}
        </p>
      </div>

      <p
        className={cn(
          "font-orbitron text-2xl font-extrabold uppercase tracking-[0.04em] leading-8",
          callsignDisplay === "Unassigned"
            ? "text-neutral-600"
            : "text-neutral-50",
        )}
      >
        {callsignDisplay}
      </p>

      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-baseline gap-3 font-jetbrains-mono text-xs uppercase tracking-[0.16em] leading-4"
          >
            <span className="shrink-0 text-neutral-500">{row.label}</span>
            <span
              className="min-w-4 flex-1 border-b border-dotted border-neutral-700"
              aria-hidden
            />
            <span
              className={cn(
                "shrink-0 font-bold",
                statusClass(row.status, provisioned),
              )}
            >
              {row.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
