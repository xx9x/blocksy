"use client";

import Link from "next/link";
import { ArrowRight, Blocks, Flame, GraduationCap, ListChecks } from "lucide-react";
import { BRICK_COLORS, footprint, type BrickColor } from "@/lib/bricks";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { FEATURES } from "@/lib/features";
import { currentStreak } from "@/lib/dates";
import { learningProgress, placedBricks, type DemoState } from "@/lib/store";
import { IsoBuild } from "@/components/bricks/IsoBuild";
import { FeatureIcon } from "@/components/FeatureIcon";
import { Card, Pill } from "@/components/ui";
import { AchievementBadge } from "./AchievementBadge";
import { BrickTally } from "./BrickInventory";
import { ProgressTracker } from "./ProgressTracker";

export function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: BrickColor;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const c = BRICK_COLORS[color];
  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      <span
        className="absolute -top-5 -right-5 h-20 w-20 rounded-[22px] opacity-60"
        style={{ background: c.tint }}
        aria-hidden
      />
      <span className="relative grid h-9 w-9 place-items-center rounded-xl" style={{ background: c.hex, color: "#fff", boxShadow: "inset 0 -2px 0 rgb(0 0 0 / .12)" }}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <p className="relative mt-3 font-display text-[2rem] leading-none font-semibold text-ink tabular-nums">{value}</p>
      <p className="relative mt-1.5 text-sm font-bold text-ink">{label}</p>
      {sub && <p className="relative text-xs font-semibold text-ink-soft">{sub}</p>}
    </Card>
  );
}

export function BuildPreview({ state, className = "" }: { state: DemoState; className?: string }) {
  const placed = placedBricks(state);
  if (!placed.length) return null;
  const bricks = placed.map((p) => {
    const [w, d] = footprint(p.size, p.rotated);
    return { x: p.x, z: p.z, level: p.level, w, d, color: p.color };
  });
  return <IsoBuild bricks={bricks} unit={22} className={className} title="Your brick build" />;
}

function timeAgo(at: number, now: number) {
  const m = Math.round((now - at) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function OverviewView({
  state,
  preview = false,
  now,
  today,
}: {
  state: DemoState;
  preview?: boolean;
  now?: number;
  today?: Date;
}) {
  const { percent, tasksCompleted } = learningProgress(state);
  const streak = currentStreak(state.habits, today);
  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).sort(
    (a, b) => state.achievements[b.id] - state.achievements[a.id],
  );
  const recent = unlocked.length ? unlocked.slice(0, 3) : ACHIEVEMENTS.slice(0, 3);
  const name = state.profile?.name ?? "Builder";
  const reference = now ?? state.activity[0]?.at ?? 0;
  const hasBuild = state.placements.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Pill color="teal">Demo mode</Pill>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-[2.4rem]">Welcome back, {name}!</h1>
          <p className="mt-1 text-ink-soft">
            {state.bricks.length
              ? `You've earned ${state.bricks.length} bricks so far. Every one is a habit you've built.`
              : "Complete your first activity to earn a brick."}
          </p>
        </div>
        {!preview && (
          <Link
            href="/app/build"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Blocks className="h-4 w-4" /> Open My Build
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Bricks earned" value={state.bricks.length} sub={`${state.placements.length} placed in your build`} color="orange" icon={Blocks} />
        <StatCard label="Tasks completed" value={tasksCompleted} sub="Lessons, checks & habits" color="blue" icon={ListChecks} />
        <StatCard label="Learning progress" value={`${percent}%`} sub="Educational, not a security rating" color="green" icon={GraduationCap} />
        <StatCard label="Current streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} sub="Daily security habits" color="red" icon={Flame} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">My Blocksy Build</h2>
            {!preview && (
              <Link href="/app/build" className="inline-flex items-center gap-1 text-sm font-bold text-sky-ink hover:underline">
                Keep building <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <div className="stud-dots relative mt-4 grid min-h-[230px] place-items-center rounded-2xl bg-mist p-4">
            {hasBuild ? (
              <BuildPreview state={state} className="max-h-[260px] w-full max-w-[420px] drop-shadow-[0_16px_18px_rgb(36_36_36/0.14)]" />
            ) : (
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-ink">Your baseplate is empty</p>
                <p className="mt-1 text-sm text-ink-soft">Place your earned bricks to start your structure.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Learning progress</h2>
            <span className="font-display text-xl font-semibold text-mint-ink">{percent}%</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            Tracks lessons and checklist items completed here — not how secure your real accounts are.
          </p>
          <div className="mt-4">
            <ProgressTracker state={state} />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="text-xl font-semibold text-ink">{unlocked.length ? "Recent achievements" : "Achievements to unlock"}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <AchievementBadge achievement={a} unlocked={!!state.achievements[a.id]} size="sm" />
                <span className="leading-tight">
                  <span className="block font-display text-base font-semibold text-ink">{a.title}</span>
                  <span className="block text-xs font-semibold text-ink-soft">{a.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-semibold text-ink">Brick inventory</h2>
          <div className="mt-4">
            <BrickTally state={state} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-semibold text-ink">Quick actions</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {FEATURES.slice(0, 4).map((f) => {
              const c = BRICK_COLORS[f.color];
              const inner = (
                <>
                  <span className="grid h-8 w-8 place-items-center rounded-[10px]" style={{ background: c.tint, color: c.ink }}>
                    <FeatureIcon icon={f.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-bold text-ink">{f.action}</span>
                  <ArrowRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5" />
                </>
              );
              return (
                <li key={f.id}>
                  {preview ? (
                    <span className="group flex items-center gap-3 rounded-2xl px-2 py-1.5">{inner}</span>
                  ) : (
                    <Link href={f.href} className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-mist">
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {state.activity.length > 0 && (
        <Card className="p-5">
          <h2 className="text-xl font-semibold text-ink">Recent activity</h2>
          <ul className="mt-3 divide-y divide-line">
            {state.activity.slice(0, preview ? 3 : 6).map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="h-3 w-5 rounded-[4px]" style={{ background: BRICK_COLORS[a.color].hex, boxShadow: "inset 0 -2px 0 rgb(0 0 0 / .1)" }} aria-hidden />
                <span className="flex-1 font-semibold text-ink">{a.text}</span>
                <span className="text-xs font-bold text-ink-soft">{reference ? timeAgo(a.at, reference) : ""}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
