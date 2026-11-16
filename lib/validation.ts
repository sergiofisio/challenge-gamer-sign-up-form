export type FieldKey =
  | "callsign"
  | "email"
  | "password"
  | "confirm"
  | "terms";

export type StrengthLabel = "Weak" | "Fair" | "Good" | "Strong";

export type OperatorFault =
  | "PENDING"
  | "REQUIRED"
  | "OK"
  | "LOCKED"
  | "MISSING"
  | "TOO SHORT"
  | "TOO LONG"
  | "BAD CHARACTER"
  | "MALFORMED"
  | "MISMATCH";

const CALLSIGN_RE = /^[A-Za-z0-9_-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: StrengthLabel | null;
} {
  if (!password) return { score: 0, label: null };
  if (password.length < 8) return { score: 1, label: "Weak" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const capped = Math.min(score, 4) as 1 | 2 | 3 | 4;
  const labels: Record<1 | 2 | 3 | 4, StrengthLabel> = {
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  return { score: capped, label: labels[capped] };
}

export function validateCallsign(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter a callsign";
  if (trimmed.length < 3) return "Use at least 3 characters";
  if (trimmed.length > 20) return "Use 20 characters or fewer";
  if (!CALLSIGN_RE.test(trimmed)) {
    return "Use letters, numbers, _ or - only";
  }
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Enter your email";
  if (!EMAIL_RE.test(value.trim())) {
    return "Enter a valid email, like you@example.com";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Enter a password";
  if (value.length < 8) return "Use at least 8 characters";
  return null;
}

export function validateConfirm(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "Confirm your password";
  if (confirm !== password) return "Passwords don't match";
  return null;
}

export function validateTerms(accepted: boolean): string | null {
  if (!accepted) return "Accept the terms to continue";
  return null;
}

export function callsignFault(value: string): OperatorFault {
  const trimmed = value.trim();
  if (!trimmed) return "MISSING";
  if (trimmed.length < 3) return "TOO SHORT";
  if (trimmed.length > 20) return "TOO LONG";
  if (!CALLSIGN_RE.test(trimmed)) return "BAD CHARACTER";
  return "OK";
}

export function emailFault(value: string): OperatorFault {
  if (!value.trim()) return "MISSING";
  if (!EMAIL_RE.test(value.trim())) return "MALFORMED";
  return "OK";
}

export function passwordFault(value: string): OperatorFault {
  if (!value) return "MISSING";
  if (value.length < 8) return "TOO SHORT";
  return "OK";
}

export function confirmFault(
  password: string,
  confirm: string,
): OperatorFault {
  if (!confirm) return "MISSING";
  if (confirm !== password) return "MISMATCH";
  return "OK";
}

export function termsFault(accepted: boolean): OperatorFault {
  return accepted ? "OK" : "REQUIRED";
}
