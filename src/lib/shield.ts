import type { BrickColor } from "./bricks";

/**
 * The hero "security shield": a two-stud-deep wall whose rows widen from a
 * point at the bottom, built in running bond so every brick interlocks with
 * the row below. Shared by the 3D hero and its SVG fallback.
 */
export interface ShieldBrick {
  id: string;
  /** left edge in studs (wall is centred on x = 0) */
  x: number;
  row: number;
  /** length in studs (depth is always 2) */
  len: 2 | 4;
  color: BrickColor;
  /** "snap" bricks loop: hover above their slot, then snap in. */
  anim?: { phase: number };
}

export const SHIELD: ShieldBrick[] = [
  { id: "r0a", x: -1, row: 0, len: 2, color: "blue" },
  { id: "r1a", x: -2, row: 1, len: 4, color: "green" },
  { id: "r2a", x: -3, row: 2, len: 2, color: "yellow" },
  { id: "r2b", x: -1, row: 2, len: 4, color: "blue" },
  { id: "r3a", x: -4, row: 3, len: 4, color: "purple" },
  { id: "r3b", x: 0, row: 3, len: 4, color: "teal" },
  { id: "r4a", x: -4, row: 4, len: 2, color: "orange" },
  { id: "r4b", x: -2, row: 4, len: 4, color: "red" },
  { id: "r4c", x: 2, row: 4, len: 2, color: "green" },
  { id: "r5a", x: -4, row: 5, len: 4, color: "blue" },
  { id: "r5b", x: 0, row: 5, len: 4, color: "yellow" },
  { id: "r6a", x: -4, row: 6, len: 2, color: "teal" },
  { id: "r6b", x: -2, row: 6, len: 4, color: "purple", anim: { phase: 0 } },
  { id: "r6c", x: 2, row: 6, len: 2, color: "orange", anim: { phase: 0.45 } },
];

export interface Floater {
  id: string;
  size: "1x1" | "1x2" | "2x2";
  color: BrickColor;
  pos: [number, number, number];
  rot: [number, number, number];
  speed: number;
}

export const FLOATERS: Floater[] = [
  { id: "f1", size: "1x1", color: "red", pos: [-6.4, 7.6, 1.2], rot: [0.4, 0.6, 0.2], speed: 0.9 },
  { id: "f2", size: "1x2", color: "yellow", pos: [6.4, 6.9, -0.4], rot: [0.38, 0.9, -0.3], speed: 0.7 },
  { id: "f3", size: "2x2", color: "green", pos: [6.6, 4.6, 1.4], rot: [0.5, -0.4, 0.3], speed: 0.6 },
  { id: "f4", size: "1x1", color: "blue", pos: [-5.6, 2.0, 2.2], rot: [0.32, 0.3, 0.4], speed: 1.1 },
  { id: "f5", size: "1x2", color: "purple", pos: [-5.9, 10.6, 0.8], rot: [0.55, -0.7, 0.12], speed: 0.8 },
];
