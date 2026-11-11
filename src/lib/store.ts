"use client";

/**
 * Blocksy demo store.
 *
 * Everything lives in this browser's localStorage under one key. There is
 * no server, no real account and no password storage — the "profile" is a
 * display name and (optionally) an email the visitor typed, nothing more.
 */

import { useSyncExternalStore } from "react";
import { ACHIEVEMENTS, type Achievement } from "./achievements";
import { REWARDS, MFA_STEPS, PRIVACY_ITEMS, BREACH_STEPS, type RewardSpec } from "./content";
import { SCENARIOS } from "./phishing";
import { dayKey, lastDays } from "./dates";
import {
  EMPTY_STATE,
  STORAGE_KEY,
  overlaps,
  resolvePlacement,
  type DemoState,
  type EarnedBrick,
  type MotionPref,
  type Placement,
} from "./state";

export * from "./state";

/* ------------------------------------------------------------------ */
/*  External store plumbing                                            */
/* ------------------------------------------------------------------ */

let state: DemoState = EMPTY_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoState>;
      if (parsed && parsed.version === 1) state = { ...EMPTY_STATE, ...parsed } as DemoState;
    }
  } catch {
    // Storage unavailable (private mode, blocked) — run in memory only.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* in-memory only */
  }
}

function emit() {
  for (const l of listeners) l();
}

function set(updater: (s: DemoState) => DemoState) {
  load();
  const before = state;
  state = updater(state);
  if (state === before) return;
  state = unlockAchievements(state);
  persist();
  emit();
}

export function getState(): DemoState {
  load();
  return state;
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      state = EMPTY_STATE;
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDemo<T = DemoState>(selector?: (s: DemoState) => T): T {
  const s = useSyncExternalStore(subscribe, getState, () => EMPTY_STATE);
  return selector ? selector(s) : (s as unknown as T);
}

/** True once the client has read localStorage (avoids flashing empty UI). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/*  Celebrations (in-memory queue, not persisted)                      */
/* ------------------------------------------------------------------ */

export type Celebration =
  | { id: string; kind: "brick"; brick: EarnedBrick }
  | { id: string; kind: "achievement"; achievement: Achievement };

let celebrations: Celebration[] = [];
const celebrationListeners = new Set<() => void>();

function pushCelebration(c: Celebration) {
  celebrations = [...celebrations, c].slice(-4);
  for (const l of celebrationListeners) l();
}

export function dismissCelebration(id: string) {
  celebrations = celebrations.filter((c) => c.id !== id);
  for (const l of celebrationListeners) l();
}

export function useCelebrations(): Celebration[] {
  return useSyncExternalStore(
    (l) => {
      celebrationListeners.add(l);
      return () => celebrationListeners.delete(l);
    },
    () => celebrations,
    () => EMPTY_CELEBRATIONS,
  );
}
const EMPTY_CELEBRATIONS: Celebration[] = [];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function grant(s: DemoState, key: string, spec: RewardSpec, source: string): DemoState {
  if (s.rewards[key]) return s;
  const brick: EarnedBrick = {
    id: uid(),
    color: spec.color,
    size: spec.size,
    source,
    earnedAt: Date.now(),
  };
  pushCelebration({ id: brick.id, kind: "brick", brick });
  return {
    ...s,
    bricks: [...s.bricks, brick],
    rewards: { ...s.rewards, [key]: Date.now() },
    activity: [{ at: Date.now(), text: source, color: spec.color }, ...s.activity].slice(0, 30),
  };
}

function unlockAchievements(s: DemoState): DemoState {
  if (!s.profile) return s;
  let next = s;
  for (const a of ACHIEVEMENTS) {
    if (next.achievements[a.id]) continue;
    const [cur, goal] = a.progress(next);
    if (cur >= goal) {
      next = { ...next, achievements: { ...next.achievements, [a.id]: Date.now() } };
      pushCelebration({ id: `ach-${a.id}`, kind: "achievement", achievement: a });
    }
  }
  return next;
}

function ensureProfile(s: DemoState): DemoState {
  if (s.profile) return s;
  return startDemoState(s, "Builder");
}

function startDemoState(s: DemoState, name: string, email?: string): DemoState {
  let next: DemoState = {
    ...s,
    profile: { name: name.trim() || "Builder", email: email?.trim() || undefined, startedAt: Date.now() },
  };
  REWARDS.starter.forEach((spec, i) => {
    const key = `starter:${i}`;
    if (next.rewards[key]) return;
    next = {
      ...next,
      bricks: [
        ...next.bricks,
        { id: uid(), color: spec.color, size: spec.size, source: "Starter kit", earnedAt: Date.now() },
      ],
      rewards: { ...next.rewards, [key]: Date.now() },
    };
  });
  return next;
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export const actions = {
  startDemo(name: string, email?: string) {
    set((s) => startDemoState(s, name, email));
  },
  ensureDemo() {
    set((s) => (s.profile ? s : ensureProfile(s)));
  },
  signOut() {
    set((s) => ({ ...s, profile: null }));
  },
  resetAll() {
    state = EMPTY_STATE;
    persist();
    emit();
  },
  rename(name: string) {
    set((s) => (s.profile ? { ...s, profile: { ...s.profile, name: name.trim() || "Builder" } } : s));
  },
  setMotion(motion: MotionPref) {
    set((s) => ({ ...s, settings: { ...s.settings, motion } }));
  },

  /* Password */
  passwordChecked(score: number) {
    set((s) => {
      let n = ensureProfile(s);
      n = grant(n, "password:first", REWARDS.passwordFirstCheck, "Tried the password checker");
      if (score >= 3) n = grant(n, "password:strong", REWARDS.passwordStrong, "Built a strong password");
      return n;
    });
  },
  passwordLesson() {
    set((s) => grant(ensureProfile(s), "password:lesson", REWARDS.passwordLesson, "Completed the password lesson"));
  },

  /* Phishing */
  answerScenario(id: string, correct: boolean) {
    set((s) => {
      let n = ensureProfile(s);
      if (n.phishing[id]) return n;
      n = { ...n, phishing: { ...n.phishing, [id]: { correct, at: Date.now() } } };
      if (correct) n = grant(n, `phishing:${id}`, REWARDS.phishingCorrect, "Spotted a phishing example correctly");
      if (SCENARIOS.every((sc) => n.phishing[sc.id]))
        n = grant(n, "phishing:lesson", REWARDS.phishingLesson, "Finished a phishing practice round");
      return n;
    });
  },
  resetPhishing() {
    set((s) => ({ ...s, phishing: {} }));
  },

  /* MFA */
  toggleMfa(id: string) {
    set((s) => {
      let n = ensureProfile(s);
      const on = !n.mfa[id];
      n = { ...n, mfa: { ...n.mfa, [id]: on } };
      if (on) n = grant(n, `mfa:${id}`, REWARDS.mfaStep, "Worked through an MFA step");
      if (MFA_STEPS.every((m) => n.mfa[m.id]))
        n = grant(n, "mfa:module", REWARDS.mfaModule, "Completed the MFA Builder");
      return n;
    });
  },

  /* Privacy */
  togglePrivacy(id: string) {
    set((s) => {
      let n = ensureProfile(s);
      const on = !n.privacy[id];
      n = { ...n, privacy: { ...n.privacy, [id]: on } };
      if (on) n = grant(n, `privacy:${id}`, REWARDS.privacyItem, "Completed a privacy check");
      if (PRIVACY_ITEMS.every((p) => n.privacy[p.id]))
        n = grant(n, "privacy:module", REWARDS.privacyModule, "Completed the Privacy Check");
      return n;
    });
  },

  /* Breach */
  toggleBreachStep(id: string) {
    set((s) => {
      let n = ensureProfile(s);
      const on = !n.breach[id];
      n = { ...n, breach: { ...n.breach, [id]: on } };
      if (on) n = grant(n, `breach:${id}`, REWARDS.breachStep, "Learned a breach response step");
      if (BREACH_STEPS.every((b) => n.breach[b.id]))
        n = grant(n, "breach:lesson", REWARDS.breachLesson, "Finished the breach awareness lesson");
      return n;
    });
  },

  /* Habits */
  toggleHabit(habitId: string, date = dayKey()) {
    set((s) => {
      let n = ensureProfile(s);
      const today = n.habits[date] ?? [];
      const on = !today.includes(habitId);
      const updated = on ? [...today, habitId] : today.filter((h) => h !== habitId);
      n = { ...n, habits: { ...n.habits, [date]: updated } };
      if (on) n = grant(n, `habit:${date}:${habitId}`, REWARDS.habit, "Logged a security habit");
      // Weekly milestone: habits logged on 5 of the last 7 days.
      const days = lastDays(7).filter((d) => (n.habits[dayKey(d)] ?? []).length > 0).length;
      if (days >= 5) {
        const week = `habit-week:${dayKey(lastDays(7)[0])}`;
        n = grant(n, week, REWARDS.habitWeek, "Hit a weekly habit milestone");
      }
      return n;
    });
  },

  /* Builder */
  placeBrick(p: Placement): string | null {
    const s = getState();
    const brick = s.bricks.find((b) => b.id === p.brickId);
    if (!brick) return "That brick isn't in your inventory.";
    if (s.placements.some((q) => q.brickId === p.brickId)) return "That brick is already placed.";
    const check = resolvePlacement(s, brick.size, p.x, p.z, p.rotated);
    if (!check.ok) return check.reason;
    set((st) => ({
      ...st,
      placements: [...st.placements, { ...p, level: check.level }],
    }));
    return null;
  },
  removeBrick(brickId: string): string | null {
    const s = getState();
    const p = s.placements.find((q) => q.brickId === brickId);
    if (!p) return null;
    const above = s.placements.some((q) => q.level === p.level + 1 && overlaps(s, p, q));
    if (above) return "Remove the bricks stacked on top first.";
    set((st) => ({ ...st, placements: st.placements.filter((q) => q.brickId !== brickId) }));
    return null;
  },
  resetBuild() {
    set((s) => ({ ...s, placements: [] }));
  },
};

