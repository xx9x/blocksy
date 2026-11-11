/**
 * Pure demo-state types and rules (no React), safe to import anywhere,
 * including Server Components.
 */
import { footprint, type BrickColor, type BrickSize } from "./bricks";
import { MFA_STEPS, PRIVACY_ITEMS, BREACH_STEPS } from "./content";
import { SCENARIOS } from "./phishing";

export const STORAGE_KEY = "blocksy-demo-v1";
export const BOARD_SIZE = 12;
export const MAX_LEVEL = 10;

export interface EarnedBrick {
  id: string;
  color: BrickColor;
  size: BrickSize;
  source: string;
  earnedAt: number;
}

export interface Placement {
  brickId: string;
  x: number;
  z: number;
  level: number;
  rotated: boolean;
}

export type MotionPref = "system" | "reduced" | "full";

export interface DemoState {
  version: 1;
  profile: { name: string; email?: string; startedAt: number } | null;
  bricks: EarnedBrick[];
  placements: Placement[];
  rewards: Record<string, number>;
  achievements: Record<string, number>;
  phishing: Record<string, { correct: boolean; at: number }>;
  mfa: Record<string, boolean>;
  privacy: Record<string, boolean>;
  breach: Record<string, boolean>;
  habits: Record<string, string[]>;
  activity: { at: number; text: string; color: BrickColor }[];
  settings: { motion: MotionPref };
}

export const EMPTY_STATE: DemoState = {
  version: 1,
  profile: null,
  bricks: [],
  placements: [],
  rewards: {},
  achievements: {},
  phishing: {},
  mfa: {},
  privacy: {},
  breach: {},
  habits: {},
  activity: [],
  settings: { motion: "system" },
};

/* ------------------------------------------------------------------ */
/*  Builder geometry rules (shared by the 3D and 2D builders)          */
/* ------------------------------------------------------------------ */

function rect(s: DemoState, p: Placement) {
  const b = s.bricks.find((x) => x.id === p.brickId);
  const [w, d] = b ? footprint(b.size, p.rotated) : [1, 1];
  return { x0: p.x, z0: p.z, x1: p.x + w, z1: p.z + d };
}

export function overlaps(s: DemoState, a: Placement, b: Placement) {
  const r1 = rect(s, a);
  const r2 = rect(s, b);
  return r1.x0 < r2.x1 && r2.x0 < r1.x1 && r1.z0 < r2.z1 && r2.z0 < r1.z1;
}

/** Height map: number of brick layers at each stud cell. */
export function heightMap(s: DemoState): number[][] {
  const map = Array.from({ length: BOARD_SIZE }, () => new Array<number>(BOARD_SIZE).fill(0));
  for (const p of s.placements) {
    const r = rect(s, p);
    for (let x = r.x0; x < r.x1; x++)
      for (let z = r.z0; z < r.z1; z++)
        if (map[x]) map[x][z] = Math.max(map[x][z] ?? 0, p.level + 1);
  }
  return map;
}

export function resolvePlacement(
  s: DemoState,
  size: BrickSize,
  x: number,
  z: number,
  rotated: boolean,
): { ok: true; level: number } | { ok: false; reason: string; level: number } {
  const [w, d] = footprint(size, rotated);
  if (x < 0 || z < 0 || x + w > BOARD_SIZE || z + d > BOARD_SIZE)
    return { ok: false, reason: "That brick would hang off the baseplate.", level: 0 };
  const map = heightMap(s);
  let level = 0;
  for (let i = x; i < x + w; i++) for (let j = z; j < z + d; j++) level = Math.max(level, map[i][j]);
  if (level >= MAX_LEVEL) return { ok: false, reason: `Builds can be up to ${MAX_LEVEL} bricks tall.`, level };
  return { ok: true, level };
}

/** Placement joined with its brick, for rendering. */
export function placedBricks(s: DemoState) {
  return s.placements
    .map((p) => {
      const b = s.bricks.find((x) => x.id === p.brickId);
      return b ? { ...p, color: b.color, size: b.size } : null;
    })
    .filter((x): x is Placement & { color: BrickColor; size: BrickSize } => x !== null);
}

/* ------------------------------------------------------------------ */
/*  Derived progress                                                   */
/* ------------------------------------------------------------------ */

export function learningProgress(s: DemoState) {
  const modules = [
    { id: "password", label: "Password Check", color: "blue" as BrickColor, done: s.rewards["password:lesson"] ? 1 : 0, total: 1 },
    { id: "phishing", label: "Phishing Practice", color: "yellow" as BrickColor, done: Object.keys(s.phishing).length, total: SCENARIOS.length },
    { id: "mfa", label: "MFA Builder", color: "green" as BrickColor, done: MFA_STEPS.filter((m) => s.mfa[m.id]).length, total: MFA_STEPS.length },
    { id: "privacy", label: "Privacy Check", color: "purple" as BrickColor, done: PRIVACY_ITEMS.filter((p) => s.privacy[p.id]).length, total: PRIVACY_ITEMS.length },
    { id: "breach", label: "Breach Awareness", color: "red" as BrickColor, done: BREACH_STEPS.filter((b) => s.breach[b.id]).length, total: BREACH_STEPS.length },
  ];
  const done = modules.reduce((a, m) => a + m.done, 0);
  const total = modules.reduce((a, m) => a + m.total, 0);
  const tasksCompleted =
    (s.rewards["password:lesson"] ? 1 : 0) +
    Object.keys(s.phishing).length +
    Object.values(s.mfa).filter(Boolean).length +
    Object.values(s.privacy).filter(Boolean).length +
    Object.values(s.breach).filter(Boolean).length +
    Object.values(s.habits).reduce((a, d) => a + d.length, 0);
  return { modules, percent: total ? Math.round((done / total) * 100) : 0, tasksCompleted };
}
