"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import eyeIcon from "@/public/assets/images/icon-eye.svg";
import eyeOffIcon from "@/public/assets/images/icon-eye-off.svg";
import tickIcon from "@/public/assets/images/icon-tick-20.svg";
import FieldError from "./field-error";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  hint?: string;
  hintId?: string;
  showValid?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  describedByExtra?: string;
  showErrorMessage?: boolean;
}

export default function FormField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  hintId,
  showValid = false,
  disabled = false,
  autoComplete,
  describedByExtra,
  showErrorMessage = true,
}: FormFieldProps) {
  const [visible, setVisible] = useState(false);
  const generatedHintId = useId();
  const errorId = `${id}-error`;
  const resolvedHintId = hintId ?? (hint ? generatedHintId : undefined);
  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  const describedBy = [
    error ? errorId : null,
    !error && resolvedHintId ? resolvedHintId : null,
    describedByExtra,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-jetbrains-mono text-sm font-medium uppercase leading-6 tracking-normal text-neutral-300"
      >
        <span className="text-lime-500" aria-hidden="true">
          {"> "}
        </span>
        {label}
      </label>

      <div
        className={cn(
          "field-focus relative flex min-h-12 items-center border border-neutral-700 bg-navy-950",
          error && "field-error",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "w-full bg-transparent px-4 py-3 font-jetbrains-mono text-base leading-6 text-neutral-50 outline-none placeholder:text-neutral-600",
            isPassword && !visible && value ? "tracking-[0.16em]" : undefined,
            isPassword ? "pr-20" : showValid ? "pr-12" : undefined,
          )}
        />

        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
          {showValid && !error ? (
            <Image src={tickIcon} alt="" width={20} height={20} aria-hidden />
          ) : null}

          {isPassword ? (
            <button
              type="button"
              disabled={disabled}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
              className="grid size-6 place-items-center text-neutral-400 hover:text-lime-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
            >
              <Image
                src={visible ? eyeOffIcon : eyeIcon}
                alt=""
                width={20}
                height={20}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      </div>

      {error && showErrorMessage ? (
        <FieldError id={errorId} message={error} />
      ) : hint && resolvedHintId && !error ? (
        <p
          id={resolvedHintId}
          className="font-jetbrains-mono text-xs leading-4 text-neutral-500"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
