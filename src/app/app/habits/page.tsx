"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, CheckCircle2, Circle, Flame } from "lucide-react";
import { HABITS, MFA_STEPS, PRIVACY_ITEMS, BREACH_STEPS } from "@/lib/content";
import { SCENARIOS } from "@/lib/phishing";
import { BRICK_COLORS } from "@/lib/bricks";
import { currentStreak, dayKey, lastDays } from "@/lib/dates";
import { actions, useDemo } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, ProgressBar } from "@/components/ui";
import { IsoBuild } from "@/components/bricks/IsoBuild";

export default function HabitsPage() {
  const s = useDemo();
  const [now] = useState(() => new Date());
  const today = dayKey(now);
  const todays = s.habits[today] ?? [];
  const streak = currentStreak(s.habits, now);
  const week = lastDays(7, now);
  const activeDays = week.filter((d) => (s.habits[dayKey(d)] ?? []).length > 0).length;

  const personal = [
    { label: "Finish the password lesson", done: !!s.rewards["password:lesson"], href: "/app/password" },
    { label: "Complete a phishing practice round", done: SCENARIOS.every((x) => s.phishing[x.id]) || !!s.rewards["phishing:lesson"], href: "/app/phishing" },
    { label: "Work through the MFA checklist", done: MFA_STEPS.every((m) => s.mfa[m.id]), href: "/app/mfa" },
    { label: "Run the privacy checkup", done: PRIVACY_ITEMS.every((p) => s.privacy[p.id]), href: "/app/privacy" },
    { label: "Build a breach response plan", done: BREACH_STEPS.every((b) => s.breach[b.id]), href: "/app/breach" },
    { label: "Place 10 bricks in your build", done: s.placements.length >= 10, href: "/app/build" },
  ];

  const milestones = [
    { label: "3-day streak", value: Math.min(streak, 3), goal: 3 },
    { label: "Active 5 of the last 7 days", value: Math.min(activeDays, 5), goal: 5 },
    { label: "25 bricks earned", value: Math.min(s.bricks.length, 25), goal: 25 },
  ];

  return (
    <>
      <PageHeader
        title="Habit Tracker"
        badge="Orange bricks · Everyday security habits"
        color="orange"
        description="Security is mostly small things done often. Log what you did today, keep your streak going and watch your week fill up with bricks."
        bricks={[
          { x: 0, z: 0, level: 0, w: 1, d: 1, color: "orange" },
          { x: 1, z: 0, level: 0, w: 1, d: 1, color: "orange" },
          { x: 2, z: 0, level: 0, w: 1, d: 1, color: "orange" },
          { x: 1, z: 0, level: 1, w: 2, d: 1, color: "orange" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-ink">Today&apos;s habits</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4EA] px-3 py-1 text-sm font-extrabold text-orange-ink">
                <Flame className="h-4 w-4" /> {streak}-day streak
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">Each habit you log earns an orange 1×1 brick (once per habit per day).</p>
            <ul className="mt-4 flex flex-col gap-2">
              {HABITS.map((h) => {
                const on = todays.includes(h.id);
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => actions.toggleHabit(h.id, today)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                        on ? "border-transparent bg-[#FFF4EA] shadow-[inset_0_0_0_1.5px_#FFB36B]" : "border-line hover:bg-mist"
                      }`}
                    >
                      <span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px]"
                        style={{
                          background: on ? "#FFB36B" : "#F3F4F7",
                          boxShadow: on ? "inset 0 -3px 0 rgb(0 0 0 / .12)" : "inset 0 0 0 1.5px #E1E3E8",
                        }}
                        aria-hidden
                      >
                        {on && <Check className="h-4.5 w-4.5 text-white" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="block font-bold text-ink">{h.title}</span>
                        <span className="block text-sm text-ink-soft">{h.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="text-2xl font-semibold text-ink">This week</h2>
            <ol className="mt-5 grid grid-cols-7 gap-2">
              {week.map((d) => {
                const k = dayKey(d);
                const n = (s.habits[k] ?? []).length;
                const isToday = k === today;
                return (
                  <li key={k} className="flex flex-col items-center gap-2">
                    <div className="flex h-36 w-full items-end justify-center rounded-2xl bg-mist pb-2">
                      {n > 0 ? (
                        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                          <IsoBuild
                            bricks={Array.from({ length: n }, (_, i) => ({
                              x: 0,
                              z: 0,
                              level: i,
                              w: 1,
                              d: 1,
                              color: (["orange", "yellow", "red", "green", "blue"] as const)[i % 5],
                            }))}
                            unit={16}
                            className="w-8 sm:w-10"
                          />
                        </motion.div>
                      ) : (
                        <span className="mb-1 h-2 w-2 rounded-full bg-line" />
                      )}
                    </div>
                    <span className={`text-xs font-extrabold ${isToday ? "text-orange-ink" : "text-ink-soft"}`}>
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-sm text-ink-soft">
              Log habits on 5 of 7 days to unlock a weekly milestone: an orange 2×4 brick.
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-5 sm:p-7">
            <h2 className="text-2xl font-semibold text-ink">Milestones</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {milestones.map((m) => (
                <li key={m.label}>
                  <div className="mb-1.5 flex justify-between text-sm font-bold">
                    <span className="text-ink">{m.label}</span>
                    <span className="text-ink-soft tabular-nums">
                      {m.value}/{m.goal}
                    </span>
                  </div>
                  <ProgressBar value={(m.value / m.goal) * 100} color="orange" label={m.label} />
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="text-2xl font-semibold text-ink">Personal security checklist</h2>
            <ul className="mt-3 flex flex-col">
              {personal.map((p) => (
                <li key={p.label}>
                  <Link href={p.href} className="group flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-mist">
                    {p.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-mint-ink" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-line" />
                    )}
                    <span className={`flex-1 text-[15px] font-semibold ${p.done ? "text-ink-soft line-through" : "text-ink"}`}>
                      {p.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="text-2xl font-semibold text-ink">Completed activities</h2>
            {s.activity.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft">Nothing yet — your log will appear here.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {s.activity.slice(0, 8).map((a, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="h-3 w-5 shrink-0 rounded-[4px]" style={{ background: BRICK_COLORS[a.color].hex }} aria-hidden />
                    <span className="flex-1 font-semibold text-ink">{a.text}</span>
                    <span className="text-xs font-bold text-ink-soft">
                      {new Date(a.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
