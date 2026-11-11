"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Mail,
  MessageCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
import { SCENARIOS, type Scenario } from "@/lib/phishing";
import { actions, useDemo } from "@/lib/store";
import { Button, Card } from "@/components/ui";
import { IsoBuild } from "@/components/bricks/IsoBuild";

const KIND_LABEL = {
  email: { label: "Email", icon: Mail },
  sms: { label: "Text message", icon: Smartphone },
  social: { label: "Social DM", icon: MessageCircle },
  login: { label: "Login page", icon: Lock },
};

function EmailMock({ s }: { s: Scenario }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center gap-3 border-b border-line bg-mist px-4 py-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-lav/30 font-display font-semibold text-lav-ink">
          {s.from.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-bold text-ink">{s.from}</p>
          <p className="truncate text-xs text-ink-soft">&lt;{s.fromDetail}&gt;</p>
        </div>
        <span className="text-xs text-ink-soft">{s.time}</span>
      </div>
      <div className="px-5 py-4">
        <p className="font-bold text-ink">{s.subject}</p>
        <div className="mt-3 flex flex-col gap-2.5 text-[15px] text-ink">
          {s.body.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
        {s.cta && (
          <span className="mt-4 inline-block rounded-lg bg-[#2F6FDE] px-4 py-2 text-sm font-bold text-white">{s.cta.label}</span>
        )}
      </div>
    </div>
  );
}

function SmsMock({ s }: { s: Scenario }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-[34px] border-[6px] border-ink/90 bg-white p-3 shadow-soft">
      <div className="flex flex-col items-center border-b border-line pb-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-mist text-ink-soft">
          <Smartphone className="h-4 w-4" />
        </span>
        <span className="mt-1 text-xs font-bold text-ink">{s.from}</span>
        <span className="text-[11px] text-ink-soft">{s.fromDetail}</span>
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-soft">{s.time}</p>
      <div className="mt-2 max-w-[85%] rounded-[20px] rounded-bl-md bg-[#EEF0F4] px-3.5 py-2.5 text-[14.5px] text-ink">
        {s.body.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
        {s.cta && <p className="mt-1 break-all text-[#2F6FDE] underline">{s.cta.label}</p>}
      </div>
    </div>
  );
}

function SocialMock({ s }: { s: Scenario }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="h-10 w-10 rounded-full bg-gradient-to-br from-coral to-sun" />
        <div className="leading-tight">
          <p className="font-bold text-ink">{s.from}</p>
          <p className="text-xs text-ink-soft">{s.fromDetail}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-4">
        {s.body.map((b, i) => (
          <p key={i} className="max-w-[85%] rounded-[18px] rounded-bl-md bg-[#F3EEFF] px-3.5 py-2.5 text-[14.5px] text-ink">
            {b}
          </p>
        ))}
        {s.cta && <p className="max-w-[85%] rounded-[18px] bg-[#F3EEFF] px-3.5 py-2.5 text-[14.5px] text-[#2F6FDE] underline">{s.cta.label}</p>}
        <p className="text-[11px] text-ink-soft">{s.time}</p>
      </div>
    </div>
  );
}

function LoginMock({ s }: { s: Scenario }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center gap-2 border-b border-line bg-mist px-3 py-2.5">
        <span className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-coral" />
          <span className="h-2.5 w-2.5 rounded-full bg-sun" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
        </span>
        <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] text-ink">
          <Lock className="h-3 w-3 shrink-0 text-ink-soft" />
          <span className="truncate font-mono">{s.url}</span>
        </span>
      </div>
      <div className="mx-auto flex max-w-xs flex-col items-center px-5 py-7 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun/40 font-display text-lg font-semibold text-sun-ink">
          {s.from.slice(0, 1)}
        </span>
        <p className="mt-3 font-display text-lg font-semibold text-ink">{s.body[0]}</p>
        <p className="text-sm text-ink-soft">{s.body[1]}</p>
        <span className="mt-4 h-10 w-full rounded-xl border border-line" />
        <span className="mt-2 h-10 w-full rounded-xl border border-line" />
        <span className="mt-3 h-10 w-full rounded-xl bg-ink" />
      </div>
    </div>
  );
}

function Mock({ s }: { s: Scenario }) {
  if (s.kind === "email") return <EmailMock s={s} />;
  if (s.kind === "sms") return <SmsMock s={s} />;
  if (s.kind === "social") return <SocialMock s={s} />;
  return <LoginMock s={s} />;
}

export function PhishingQuiz() {
  const answers = useDemo((s) => s.phishing);
  const firstOpen = SCENARIOS.findIndex((s) => !answers[s.id]);
  const [index, setIndex] = useState(firstOpen === -1 ? SCENARIOS.length : firstOpen);
  const [pick, setPick] = useState<null | "safe" | "suspicious">(null);

  const finished = index >= SCENARIOS.length;
  const correct = SCENARIOS.filter((s) => answers[s.id]?.correct).length;

  if (finished) {
    return (
      <Card className="p-6 text-center sm:p-10">
        <IsoBuild
          bricks={[
            { x: 0, z: 0, level: 0, w: 4, d: 2, color: "yellow" },
            { x: 1, z: 0, level: 1, w: 2, d: 2, color: "yellow" },
            { x: 1, z: 0, level: 2, w: 2, d: 1, color: "orange" },
          ]}
          unit={28}
          className="mx-auto h-32 w-auto drop-shadow-[0_14px_14px_rgb(36_36_36/0.14)]"
        />
        <h2 className="mt-5 text-3xl font-semibold text-ink">Round complete!</h2>
        <p className="mt-2 text-lg text-ink-soft">
          You spotted <strong className="text-ink">{correct}</strong> of {SCENARIOS.length} correctly.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Every correct answer earned a yellow brick, and finishing the round earned a yellow 2×4. Practicing again
          won&apos;t duplicate rewards, but it&apos;s great for building instinct.
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => {
            actions.resetPhishing();
            setIndex(0);
            setPick(null);
          }}
        >
          <RotateCcw className="h-4 w-4" /> Practice again
        </Button>
      </Card>
    );
  }

  const s = SCENARIOS[index];
  const answered = pick !== null;
  const wasRight = pick === s.verdict;
  const K = KIND_LABEL[s.kind];

  const previousPick = (sc?: Scenario) => {
    const a = sc && answers[sc.id];
    if (!sc || !a) return null;
    return a.correct ? sc.verdict : sc.verdict === "safe" ? "suspicious" : "safe";
  };
  const goTo = (i: number) => {
    setIndex(i);
    setPick(previousPick(SCENARIOS[i]));
  };

  const choose = (v: "safe" | "suspicious") => {
    if (answered) return;
    setPick(v);
    actions.answerScenario(s.id, v === s.verdict);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E3] px-3 py-1 text-xs font-extrabold text-sun-ink">
            <K.icon className="h-3.5 w-3.5" /> {K.label}
          </span>
          <span className="text-sm font-bold text-ink-soft tabular-nums">
            {index + 1} / {SCENARIOS.length}
          </span>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {SCENARIOS.map((sc, i) => (
            <span
              key={sc.id}
              className={`h-1.5 flex-1 rounded-full ${
                answers[sc.id] ? (answers[sc.id].correct ? "bg-mint" : "bg-coral") : i === index ? "bg-sun" : "bg-mist"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-ink-soft">
          Fictional example — all names, numbers and links are made up and don&apos;t go anywhere.
        </p>
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <Mock s={s} />
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>

      <Card className="flex flex-col p-5 sm:p-6">
        {!answered ? (
          <>
            <h2 className="text-2xl font-semibold text-ink">Safe or suspicious?</h2>
            <p className="mt-2 text-ink-soft">
              Look at the sender, the link, the tone and what it asks you to do. Then make your call.
            </p>
            <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button
                type="button"
                onClick={() => choose("safe")}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-mint bg-[#EDFAF2] px-4 py-4 font-display text-lg font-semibold text-mint-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <ShieldCheck className="h-5 w-5" /> Looks safe
              </button>
              <button
                type="button"
                onClick={() => choose("suspicious")}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-coral bg-[#FFF0F0] px-4 py-4 font-display text-lg font-semibold text-coral-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <ShieldAlert className="h-5 w-5" /> Suspicious
              </button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col" aria-live="polite">
            <div
              className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-display text-lg font-semibold ${
                wasRight ? "bg-[#EDFAF2] text-mint-ink" : "bg-[#FFF0F0] text-coral-ink"
              }`}
            >
              {wasRight ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {wasRight ? "Nice catch!" : "Not quite."} This one is {s.verdict === "safe" ? "safe" : "suspicious"}.
            </div>
            <h3 className="mt-5 font-bold text-ink">{s.verdict === "safe" ? "Why it's okay" : "The clues"}</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {s.clues.map((c, i) => (
                <li key={i} className="flex gap-2 text-[15px] text-ink">
                  <span
                    className={`mt-1.5 h-2 w-3 shrink-0 rounded-[3px] ${s.verdict === "safe" ? "bg-mint" : "bg-sun"}`}
                    aria-hidden
                  />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-mist p-3.5 text-sm font-semibold text-ink">{s.takeaway}</p>
            <div className="mt-auto flex justify-between gap-2 pt-6">
              {index > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => goTo(index - 1)}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <span />
              )}
              <Button
                onClick={() => goTo(index + 1)}
              >
                {index + 1 < SCENARIOS.length ? "Next example" : "See results"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
