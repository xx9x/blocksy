"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, Info } from "lucide-react";
import { analyzePassword } from "@/lib/password";
import { actions } from "@/lib/store";
import { BRICK_COLORS } from "@/lib/bricks";
import { Button } from "@/components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm font-semibold text-coral-ink">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      ) : (
        hint
      )}
    </div>
  );
}

const inputCls = (bad: boolean) =>
  `h-12 w-full rounded-2xl border bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/60 focus:ring-4 ${
    bad ? "border-coral focus:ring-coral/20" : "border-line focus:border-sky focus:ring-sky/20"
  }`;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors: { email?: string; password?: string; confirm?: string } = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "That doesn't look like an email address.";
  if (!password) errors.password = "Enter a password.";
  else if (mode === "signup" && password.length < 12) errors.password = "Use at least 12 characters.";
  if (mode === "signup") {
    if (!confirm) errors.confirm = "Confirm your password.";
    else if (confirm !== password) errors.confirm = "Passwords don't match.";
  }
  const valid = Object.keys(errors).length === 0;
  const strength = mode === "signup" && password ? analyzePassword(password) : null;
  const strengthColor = strength ? BRICK_COLORS[(["red", "orange", "yellow", "green", "teal"] as const)[strength.score]] : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!valid) return;
    const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 24);
    // Only the email and a display name are kept (in this browser).
    // The password is discarded here and never stored or sent anywhere.
    actions.startDemo(name, email.trim());
    setPassword("");
    setConfirm("");
    router.push("/app");
  };

  const err = (k: keyof typeof errors) => (submitted ? errors[k] : undefined);

  return (
    <div className="w-full max-w-[420px]">
      <h1 className="text-[2.4rem] leading-[1.05] font-semibold text-ink">
        {mode === "login" ? "Welcome back" : "Start building"}
      </h1>
      <p className="mt-2 text-ink-soft">
        {mode === "login"
          ? "Log in to pick up where you left off."
          : "Create your Blocksy profile and get a free starter kit of bricks."}
      </p>

      <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#FFE7A6] bg-[#FFF8E3] p-3.5 text-sm text-ink">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sun-ink" />
        <p>
          <strong>Demo mode.</strong> Blocksy doesn&apos;t create real accounts yet. Your email stays in this browser
          only, and your password is never stored or sent anywhere.
        </p>
      </div>

      <form noValidate onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <Field id={`${id}-email`} label="Email" error={err("email")}>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!err("email")}
            aria-describedby={err("email") ? `${id}-email-error` : undefined}
            className={inputCls(!!err("email"))}
          />
        </Field>
        <Field
          id={`${id}-password`}
          label="Password"
          error={err("password")}
          hint={
            strength && (
              <p className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                <span className="flex gap-1" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1.5 w-5 rounded-full" style={{ background: i <= strength.score ? strengthColor!.hex : "#EEF0F4" }} />
                  ))}
                </span>
                {strength.label}
              </p>
            )
          }
        >
          <div className="relative">
            <input
              id={`${id}-password`}
              type={show ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!err("password")}
              aria-describedby={err("password") ? `${id}-password-error` : undefined}
              className={`${inputCls(!!err("password"))} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute top-1/2 right-1.5 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-ink-soft hover:bg-mist hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
            >
              {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </Field>
        {mode === "signup" && (
          <Field id={`${id}-confirm`} label="Confirm password" error={err("confirm")}>
            <input
              id={`${id}-confirm`}
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!err("confirm")}
              aria-describedby={err("confirm") ? `${id}-confirm-error` : undefined}
              className={inputCls(!!err("confirm"))}
            />
          </Field>
        )}
        <Button type="submit" size="lg" className="mt-2 w-full">
          {mode === "login" ? "Log in to demo" : "Continue in demo mode"} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-bold text-ink-soft">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => {
          actions.startDemo("Builder");
          router.push("/app");
        }}
      >
        Explore without signing up
      </Button>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="font-bold text-sky-ink hover:underline">
              Get started
            </Link>
          </>
        ) : (
          <>
            Already building?{" "}
            <Link href="/login" className="font-bold text-sky-ink hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
