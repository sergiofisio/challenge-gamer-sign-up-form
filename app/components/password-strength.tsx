import { cn } from "@/lib/cn";
import type { StrengthLabel } from "@/lib/validation";

const LABEL_COLORS: Record<StrengthLabel, string> = {
  Weak: "text-red-400",
  Fair: "text-amber-400",
  Good: "text-lime-500",
  Strong: "text-lime-500",
};

function segmentClass(
  segment: number,
  score: number,
  label: StrengthLabel | null,
) {
  if (!label || score < segment) return "bg-neutral-800";
  if (label === "Weak") return "bg-red-400";
  if (label === "Fair") {
    return segment === 1 ? "bg-red-400" : "bg-amber-400";
  }
  return "bg-lime-500";
}

interface PasswordStrengthProps {
  score: 0 | 1 | 2 | 3 | 4;
  label: StrengthLabel | null;
  hideHint?: boolean;
}

export default function PasswordStrength({
  score,
  label,
  hideHint = false,
}: PasswordStrengthProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-2" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn("h-1", segmentClass(segment, score, label))}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-4">
        {!hideHint ? (
          <p className="font-jetbrains-mono text-xs leading-4 text-neutral-500">
            At least 8 characters
          </p>
        ) : (
          <span />
        )}
        {label ? (
          <p
            className={cn(
              "font-jetbrains-mono text-xs font-bold uppercase tracking-[0.16em] leading-4",
              LABEL_COLORS[label],
            )}
          >
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}
