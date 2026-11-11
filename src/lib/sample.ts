import type { BrickColor, BrickSize } from "./bricks";
import { EMPTY_STATE, type DemoState, type EarnedBrick, type Placement } from "./state";
import { dayKey, lastDays } from "./dates";

/**
 * A sample builder's progress, used only for the landing-page dashboard
 * preview and the "Your Security, Your Creation" gallery. It's rendered by
 * the same components as the real dashboard.
 */

type P = [x: number, z: number, level: number, size: BrickSize, color: BrickColor, rotated?: boolean];

export const SAMPLE_CASTLE: P[] = [
  [0, 0, 0, "2x4", "teal"],
  [4, 0, 0, "2x4", "teal"],
  [0, 2, 0, "2x4", "green"],
  [4, 2, 0, "2x4", "blue"],
  [0, 0, 1, "2x2", "purple"],
  [2, 0, 1, "2x4", "yellow"],
  [6, 0, 1, "2x2", "purple"],
  [0, 2, 1, "2x4", "orange"],
  [4, 2, 1, "2x4", "red"],
  [0, 0, 2, "2x2", "blue"],
  [6, 0, 2, "2x2", "green"],
  [2, 2, 2, "2x4", "yellow"],
  [0, 0, 3, "1x2", "red", true],
  [7, 0, 3, "1x2", "orange", true],
  [3, 2, 3, "2x2", "purple"],
  [3, 2, 4, "1x2", "blue"],
  [4, 3, 4, "1x1", "yellow"],
];

export const SAMPLE_TOWER: P[] = [
  [0, 0, 0, "2x4", "blue"],
  [0, 2, 0, "2x4", "blue"],
  [1, 0, 1, "2x2", "teal"],
  [1, 2, 1, "2x2", "teal"],
  [0, 1, 2, "2x4", "green"],
  [1, 1, 3, "2x2", "yellow"],
  [1, 1, 4, "2x2", "purple"],
  [1, 1, 5, "1x2", "red"],
  [2, 2, 5, "1x1", "orange"],
];

export const SAMPLE_BRIDGE: P[] = [
  [0, 0, 0, "2x2", "orange"],
  [6, 0, 0, "2x2", "orange"],
  [0, 0, 1, "2x2", "yellow"],
  [6, 0, 1, "2x2", "yellow"],
  [0, 0, 2, "2x4", "red"],
  [4, 0, 2, "2x4", "purple"],
  [2, 0, 3, "2x4", "teal"],
  [1, 0, 3, "1x1", "green"],
  [6, 1, 3, "1x2", "blue"],
];

export function toIso(list: P[]) {
  return list.map(([x, z, level, size, color, rotated]) => {
    const [w, d] = size === "1x1" ? [1, 1] : size === "1x2" ? [2, 1] : size === "2x2" ? [2, 2] : [4, 2];
    return { x, z, level, w: rotated ? d : w, d: rotated ? w : d, color };
  });
}

/** Fixed "today" for the sample, so the preview is deterministic. */
export const SAMPLE_TODAY = new Date(Date.UTC(2026, 10, 10, 12));

export function sampleState(): DemoState {
  const now = SAMPLE_TODAY.getTime();
  const bricks: EarnedBrick[] = [];
  const placements: Placement[] = [];
  SAMPLE_CASTLE.forEach(([x, z, level, size, color, rotated], i) => {
    const id = `s${i}`;
    bricks.push({ id, size, color, source: "Sample", earnedAt: now - i * 3600_000 });
    placements.push({ brickId: id, x: x + 2, z: z + 4, level, rotated: !!rotated });
  });
  const extra: [BrickSize, BrickColor][] = [
    ["1x2", "yellow"],
    ["1x2", "yellow"],
    ["1x1", "orange"],
    ["1x1", "orange"],
    ["1x2", "green"],
    ["2x2", "blue"],
    ["1x2", "purple"],
  ];
  extra.forEach(([size, color], i) =>
    bricks.push({ id: `e${i}`, size, color, source: "Sample", earnedAt: now - (i + 20) * 3600_000 }),
  );
  const habits: Record<string, string[]> = {};
  lastDays(7, SAMPLE_TODAY).forEach((d, i) => {
    if (i !== 1) habits[dayKey(d)] = ["updates", "pause"].slice(0, (i % 2) + 1);
  });
  return {
    ...EMPTY_STATE,
    profile: { name: "Alex", startedAt: now },
    bricks,
    placements,
    rewards: { "password:lesson": now, "phishing:lesson": now },
    achievements: {
      "first-brick": now,
      "password-pro": now - 1000,
      "phish-finder": now - 2000,
      "first-build": now - 3000,
    },
    phishing: Object.fromEntries(
      ["parcel", "it-reset", "code-requested", "friend-code", "login-lookalike", "login-real", "giveaway", "newsletter"].map(
        (id, i) => [id, { correct: i !== 3, at: now }],
      ),
    ),
    mfa: { learn: true, email: true, method: true, backup: true },
    privacy: { social: true, permissions: true },
    breach: { change: true },
    habits,
    activity: [
      { at: now - 60_000, text: "Worked through an MFA step", color: "green" },
      { at: now - 3600_000, text: "Finished a phishing practice round", color: "yellow" },
      { at: now - 7200_000, text: "Completed the password lesson", color: "blue" },
      { at: now - 9000_000, text: "Completed a privacy check", color: "purple" },
    ],
  };
}
