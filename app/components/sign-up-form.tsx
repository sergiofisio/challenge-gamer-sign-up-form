"use client";

import {
  FormEvent,
  RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import {
  callsignFault,
  confirmFault,
  emailFault,
  getPasswordStrength,
  passwordFault,
  termsFault,
  validateCallsign,
  validateConfirm,
  validateEmail,
  validatePassword,
  validateTerms,
  type FieldKey,
  type OperatorFault,
} from "@/lib/validation";
import Button from "./button";
import FieldError from "./field-error";
import FormField from "./form-field";
import OperatorStatus, { type OperatorRow } from "./operator-status";
import PasswordStrength from "./password-strength";
import SuccessPanel from "./success-panel";

type TouchedMap = Record<Exclude<FieldKey, "terms">, boolean>;

const INITIAL_TOUCHED: TouchedMap = {
  callsign: false,
  email: false,
  password: false,
  confirm: false,
};

export default function SignUpForm() {
  const [callsign, setCallsign] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState<TouchedMap>(INITIAL_TOUCHED);
  const [submitted, setSubmitted] = useState(false);
  const [termsErrorVisible, setTermsErrorVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [shake, setShake] = useState(false);
  const [announce, setAnnounce] = useState("");

  const callsignRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);

  const locked = status === "submitting" || status === "success";
  const strength = getPasswordStrength(password);

  const fieldErrors = useMemo(
    () => ({
      callsign:
        touched.callsign || submitted ? validateCallsign(callsign) : null,
      email: touched.email || submitted ? validateEmail(email) : null,
      password:
        touched.password || submitted ? validatePassword(password) : null,
      confirm:
        touched.confirm || submitted
          ? validateConfirm(password, confirm)
          : null,
      terms: termsErrorVisible || submitted ? validateTerms(terms) : null,
    }),
    [
      callsign,
      email,
      password,
      confirm,
      terms,
      touched,
      submitted,
      termsErrorVisible,
    ],
  );

  const showValid = {
    callsign:
      (touched.callsign || submitted) &&
      !fieldErrors.callsign &&
      callsign.trim().length > 0,
    email:
      (touched.email || submitted) &&
      !fieldErrors.email &&
      email.trim().length > 0,
    password:
      (touched.password || submitted) &&
      !fieldErrors.password &&
      password.length > 0,
    confirm:
      (touched.confirm || submitted) &&
      !fieldErrors.confirm &&
      confirm.length > 0,
  };

  const operatorRows: OperatorRow[] = useMemo(() => {
    const resolve = (
      key: FieldKey,
      fault: OperatorFault,
      hasValue: boolean,
      wasTouched: boolean,
    ): OperatorFault => {
      if (status === "success") return "LOCKED";
      if (key === "terms") return fault;
      if (fault === "OK") return "OK";
      if ((wasTouched || submitted) && hasValue && fault !== "MISSING") {
        return fault;
      }
      if ((wasTouched || submitted) && fault === "MISSING") return "MISSING";
      return "PENDING";
    };

    return [
      {
        key: "callsign",
        label: "Callsign",
        status: resolve(
          "callsign",
          callsignFault(callsign),
          callsign.trim().length > 0,
          touched.callsign,
        ),
      },
      {
        key: "email",
        label: "Email",
        status: resolve(
          "email",
          emailFault(email),
          email.trim().length > 0,
          touched.email,
        ),
      },
      {
        key: "password",
        label: "Password",
        status: resolve(
          "password",
          passwordFault(password),
          password.length > 0,
          touched.password,
        ),
      },
      {
        key: "confirm",
        label: "Confirm",
        status: resolve(
          "confirm",
          confirmFault(password, confirm),
          confirm.length > 0,
          touched.confirm,
        ),
      },
      {
        key: "terms",
        label: "Terms",
        status: status === "success" ? "LOCKED" : termsFault(terms),
      },
    ];
  }, [callsign, email, password, confirm, terms, touched, submitted, status]);

  const readyCount = operatorRows.filter(
    (row) => row.status === "OK" || row.status === "LOCKED",
  ).length;

  const callsignDisplay = !validateCallsign(callsign)
    ? callsign.trim()
    : "Unassigned";

  const markTouched = (key: Exclude<FieldKey, "terms">) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const focusFirstInvalid = (errs: typeof fieldErrors) => {
    const order: Array<{
      key: FieldKey;
      ref: RefObject<HTMLDivElement | null>;
    }> = [
      { key: "callsign", ref: callsignRef },
      { key: "email", ref: emailRef },
      { key: "password", ref: passwordRef },
      { key: "confirm", ref: confirmRef },
      { key: "terms", ref: termsRef },
    ];

    for (const item of order) {
      if (errs[item.key]) {
        const target = item.ref.current?.querySelector<HTMLElement>(
          "input, button",
        );
        target?.focus();
        break;
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;

    setSubmitted(true);
    setTermsErrorVisible(true);
    setTouched({
      callsign: true,
      email: true,
      password: true,
      confirm: true,
    });

    const nextErrors = {
      callsign: validateCallsign(callsign),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
      terms: validateTerms(terms),
    };

    const invalidCount = Object.values(nextErrors).filter(Boolean).length;

    if (invalidCount > 0) {
      setAnnounce(
        `${invalidCount} field${invalidCount === 1 ? "" : "s"} need attention`,
      );
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      window.setTimeout(() => focusFirstInvalid(nextErrors), 0);
      return;
    }

    setAnnounce("");
    setStatus("submitting");
    await new Promise((resolve) => window.setTimeout(resolve, 1600));
    setStatus("success");
  };

  return (
    <div className="relative z-10 mx-auto grid w-full max-w-360 grid-cols-1 items-center gap-10 px-30! lg:grid-cols-[minmax(0,1fr)_minmax(320px,540px)] lg:gap-16 xl:gap-24">
      <div className="flex flex-col gap-8 lg:min-h-160 lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-8 lg:gap-12">
          <header className="flex items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/logo.svg"
              alt="NEONCORE"
              className="h-8 w-auto"
            />
            <p
              className={cn(
                "font-jetbrains-mono text-xs font-bold uppercase tracking-[0.16em] lg:hidden",
                status === "success" || readyCount === 5
                  ? "text-lime-500"
                  : "text-neutral-500",
              )}
            >
              {status === "success" ? "Provisioned" : `${readyCount}/5 ready`}
            </p>
          </header>

          <div className="flex flex-col gap-3 lg:gap-4">
            <h1 className="font-orbitron text-[36px] font-extrabold uppercase leading-10 tracking-[0.04em] text-neutral-50 md:text-[40px] md:leading-12 lg:text-[72px] lg:leading-20">
              <span className="text-lime-500">//</span> Join the nexus
            </h1>
            <p className="font-jetbrains-mono text-xs uppercase tracking-[0.16em] text-neutral-500">
              Initialize your NEONCORE identity
            </p>
          </div>
        </div>

        <div className="lg:hidden">
          <OperatorStatus
            compact
            callsignDisplay={callsignDisplay}
            readyCount={readyCount}
            rows={operatorRows}
            provisioned={status === "success"}
          />
        </div>

        <div className="hidden lg:block">
          <OperatorStatus
            callsignDisplay={callsignDisplay}
            readyCount={readyCount}
            rows={operatorRows}
            provisioned={status === "success"}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col corner-frame w-full border border-neutral-800 bg-navy-alpha-80 p-10! backdrop-blur-[2px] gap-5 md:p-8",
          shake && "shake",
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-neutral-800 pb-4!">
          <p className="font-jetbrains-mono text-xs uppercase tracking-[0.16em] text-neutral-400">
            New operator
          </p>
          <p className="font-jetbrains-mono text-xs uppercase tracking-[0.16em] text-neutral-500">
            <span className="hidden sm:inline">All fields required</span>
            <span className="sm:hidden">All required</span>
          </p>
        </div>

        {status === "success" ? (
          <SuccessPanel callsign={callsign.trim()} />
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-10"
          >
            <div ref={callsignRef}>
              <FormField
                id="callsign"
                name="callsign"
                label="Callsign"
                placeholder="e.g. Vortex_07"
                value={callsign}
                disabled={locked}
                autoComplete="username"
                hint="3–20 characters: letters, numbers, _ or -"
                error={fieldErrors.callsign}
                showValid={showValid.callsign}
                onChange={setCallsign}
                onBlur={() => {
                  if (callsign.length > 0) markTouched("callsign");
                }}
              />
            </div>

            <div ref={emailRef}>
              <FormField
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                disabled={locked}
                autoComplete="email"
                error={fieldErrors.email}
                showValid={showValid.email}
                onChange={setEmail}
                onBlur={() => {
                  if (email.length > 0) markTouched("email");
                }}
              />
            </div>

            <div ref={passwordRef} className="flex flex-col gap-2">
              <FormField
                key={locked ? "password-locked" : "password"}
                id="password"
                name="password"
                type="password"
                label="Password"
                value={password}
                disabled={locked}
                autoComplete="new-password"
                error={fieldErrors.password}
                showErrorMessage={false}
                showValid={showValid.password}
                onChange={setPassword}
                onBlur={() => {
                  if (password.length > 0) markTouched("password");
                }}
              />
              <PasswordStrength
                score={strength.score}
                label={strength.label}
                hideHint={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password ? (
                <FieldError id="password-error" message={fieldErrors.password} />
              ) : null}
            </div>

            <div ref={confirmRef}>
              <FormField
                key={locked ? "confirm-locked" : "confirm"}
                id="confirm"
                name="confirm"
                type="password"
                label="Confirm password"
                value={confirm}
                disabled={locked}
                autoComplete="new-password"
                error={fieldErrors.confirm}
                showValid={showValid.confirm}
                onChange={setConfirm}
                onBlur={() => {
                  if (confirm.length > 0) markTouched("confirm");
                }}
              />
            </div>

            <div ref={termsRef} className="flex flex-col gap-2">
              <label className="flex items-start gap-3 font-jetbrains-mono text-sm leading-6 text-neutral-300">
                <input
                  type="checkbox"
                  className={cn(
                    "checkbox-custom mt-0.5",
                    fieldErrors.terms && "checkbox-error",
                  )}
                  checked={terms}
                  disabled={locked}
                  aria-invalid={Boolean(fieldErrors.terms)}
                  aria-describedby={
                    fieldErrors.terms ? "terms-error" : undefined
                  }
                  onChange={(e) => {
                    setTerms(e.target.checked);
                    if (e.target.checked) setTermsErrorVisible(false);
                  }}
                />
                <span>
                  I accept the{" "}
                  <a href="#terms" className="link-lime">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="link-lime">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {fieldErrors.terms ? (
                <FieldError id="terms-error" message={fieldErrors.terms} />
              ) : null}
            </div>

            <Button
              type="submit"
              label="Initialize account"
              loading={status === "submitting"}
            />

            <p className="text-center font-jetbrains-mono text-xs leading-4 text-neutral-500">
              Already an operator?{" "}
              <a href="#login" className="link-lime">
                Log in
              </a>
            </p>
          </form>
        )}
      </div>

      <div
        id="form-status"
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        {announce}
      </div>
    </div>
  );
}
