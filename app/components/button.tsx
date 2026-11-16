import { cn } from "@/lib/cn";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
}

export default function Button({
  label,
  loading = false,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "btn-primary w-full px-4 py-4 font-orbitron text-base font-extrabold uppercase tracking-[0.16em] leading-6",
        className,
      )}
      {...props}
    >
      {loading ? "Transmitting_" : label}
    </button>
  );
}
