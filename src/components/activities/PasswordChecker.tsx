"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { analyzePassword, generatePassphrase } from "@/lib/password";
import { actions } from "@/lib/store";
import type { BrickColor } from "@/lib/bricks";
import { BRICK_COLORS } from "@/lib/bricks";
import { Button, Card } from "@/components/ui";

const SCORE_COLORS: BrickColor[] = ["red", "orange", "yellow", "green", "teal"];

export function PasswordChecker({ onChecked }: { onChecked?: () => void }) {
  const id = useId();
  const [pw, setPw] = useState("");
  const [visible, setVisible] = useState(false);
  const report = useMemo(() => (pw ? analyzePassword(pw) : null), [pw]);

  // Reward the first real check (debounced). The password itself is never
  // passed anywhere — only the resulting 0–4 score.
  const score = report?.score ?? -1;
  const length = report?.length ?? 0;
  useEffect(() => {
    if (score < 0 || length < 6) return;
    const t = setTimeout(() => {
      actions.passwordChecked(score);
      onChecked?.();
    }, 900);
    return () => clearTimeout(t);
  }, [score, length, onChecked]);

  const color = report ? BRICK_COLORS[SCORE_COLORS[report.score]] : null;

  return (
    <Card className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="font-display text-xl font-semibold text-ink">
          Try a password
        </label>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDFAF2] px-3 py-1 text-xs font-extrabold text-mint-ink">
          <ShieldCheck className="h-3.5 w-3.5" /> Checked on your device · never sent or saved
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Use an example rather than a real password — try something similar to what you&apos;d normally pick.
      </p>

      <div className="relative mt-4">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          placeholder="e.g. Summer2024!"
          className="h-14 w-full rounded-2xl border border-line bg-white pr-14 pl-4 font-mono text-lg tracking-wide text-ink outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-ink-soft/60 focus:border-sky focus:ring-4 focus:ring-sky/20"
          aria-describedby={`${id}-result`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-ink-soft hover:bg-mist hover:text-ink"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => {
            setPw(generatePassphrase());
            setVisible(true);
          }}
        >
          <Sparkles className="h-4 w-4 text-orange-ink" /> Generate an example passphrase
        </Button>
        {pw && (
          <Button variant="ghost" size="sm" type="button" onClick={() => setPw("")}>
            Clear
          </Button>
        )}
      </div>

      <div id={`${id}-result`} aria-live="polite" className="mt-6">
        {!report ? (
          <p className="rounded-2xl bg-mist px-4 py-6 text-center text-sm font-semibold text-ink-soft">
            Start typing to see a live strength breakdown.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-end justify-between">
                <span className="font-display text-3xl font-semibold" style={{ color: color!.ink }}>
                  {report.label}
                </span>
                <span className="text-right text-xs font-bold text-ink-soft">
                  Rough guess time for a fast offline attack
                  <span className="block font-display text-lg font-semibold text-ink">{report.crackTime}</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="h-3.5 rounded-[6px] transition-colors duration-300"
                    style={{
                      background: i <= report.score ? color!.hex : "#EEF0F4",
                      boxShadow: i <= report.score ? "inset 0 -2px 0 rgb(0 0 0 / .1), inset 0 1px 0 rgb(255 255 255 / .4)" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line p-4">
                <p className="text-xs font-extrabold tracking-wide text-ink-soft uppercase">Length</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  {report.length} <span className="text-base text-ink-soft">/ 16+ recommended</span>
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full rounded-full bg-sky transition-[width] duration-300"
                    style={{ width: `${Math.min(100, (report.length / 16) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <p className="text-xs font-extrabold tracking-wide text-ink-soft uppercase">Character variety</p>
                <ul className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
                  {(
                    [
                      ["lower", "a–z"],
                      ["upper", "A–Z"],
                      ["digit", "0–9"],
                      ["symbol", "#?!"],
                      ["space", "spaces"],
                    ] as const
                  ).map(([k, label]) => (
                    <li
                      key={k}
                      className={`rounded-full px-2.5 py-1 ${report.classes[k] ? "bg-[#EDFAF2] text-mint-ink" : "bg-mist text-ink-soft"}`}
                    >
                      {report.classes[k] ? "✓ " : ""}
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {report.findings.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink">
                  {f.kind === "good" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-ink" />
                  ) : f.kind === "warn" ? (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-ink" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-coral-ink" />
                  )}
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
