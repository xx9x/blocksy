/**
 * Blocksy brick system — the single source of truth for brick colors,
 * sizes and what each color means. Used by the 3D scenes, the isometric
 * SVG illustrations, the builder and the reward system.
 */

export type BrickColor =
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "red"
  | "orange"
  | "teal";

export type BrickSize = "1x1" | "1x2" | "2x2" | "2x4";

export interface BrickColorInfo {
  key: BrickColor;
  name: string;
  hex: string;
  /** Darker tone with enough contrast for text on white. */
  ink: string;
  /** Very light tint for backgrounds. */
  tint: string;
  meaning: string;
  short: string;
}

export const BRICK_COLORS: Record<BrickColor, BrickColorInfo> = {
  blue: {
    key: "blue",
    name: "Sky Blue",
    hex: "#69B9FF",
    ink: "#1D67AD",
    tint: "#EEF7FF",
    meaning: "Password security",
    short: "Passwords",
  },
  green: {
    key: "green",
    name: "Mint Green",
    hex: "#80D9A1",
    ink: "#1C7444",
    tint: "#EDFAF2",
    meaning: "Multi-factor authentication",
    short: "MFA",
  },
  yellow: {
    key: "yellow",
    name: "Sunshine Yellow",
    hex: "#FFD45C",
    ink: "#7D5A00",
    tint: "#FFF8E3",
    meaning: "Phishing awareness",
    short: "Phishing",
  },
  purple: {
    key: "purple",
    name: "Lavender",
    hex: "#B9A0F5",
    ink: "#5E3FB8",
    tint: "#F5F1FE",
    meaning: "Privacy protection",
    short: "Privacy",
  },
  red: {
    key: "red",
    name: "Coral Red",
    hex: "#FF777B",
    ink: "#B8323A",
    tint: "#FFF0F0",
    meaning: "Security alerts",
    short: "Alerts",
  },
  orange: {
    key: "orange",
    name: "Soft Orange",
    hex: "#FFB36B",
    ink: "#99520C",
    tint: "#FFF4EA",
    meaning: "Security habits & education",
    short: "Habits",
  },
  teal: {
    key: "teal",
    name: "Light Teal",
    hex: "#78D8D0",
    ink: "#156F68",
    tint: "#ECF9F8",
    meaning: "Foundation (starter kit)",
    short: "Foundation",
  },
};

export const COLOR_ORDER: BrickColor[] = [
  "blue",
  "green",
  "yellow",
  "purple",
  "red",
  "orange",
  "teal",
];

/** Footprint in studs: [width (x), depth (z)]. */
export const BRICK_SIZES: Record<BrickSize, [number, number]> = {
  "1x1": [1, 1],
  "1x2": [2, 1],
  "2x2": [2, 2],
  "2x4": [4, 2],
};

export const SIZE_ORDER: BrickSize[] = ["2x4", "2x2", "1x2", "1x1"];

/** Physical proportions, in stud-pitch units (1 unit = 8mm on a real brick). */
export const BRICK_HEIGHT = 1.2;
export const STUD_RADIUS = 0.3;
export const STUD_HEIGHT = 0.22;
export const BRICK_GAP = 0.025;

export function footprint(size: BrickSize, rotated = false): [number, number] {
  const [w, d] = BRICK_SIZES[size];
  return rotated ? [d, w] : [w, d];
}

export function shade(hex: string, amount: number): string {
  // amount: -1 (black) … 0 … 1 (white)
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  if (amount >= 0) {
    r += (255 - r) * amount;
    g += (255 - g) * amount;
    b += (255 - b) * amount;
  } else {
    r *= 1 + amount;
    g *= 1 + amount;
    b *= 1 + amount;
  }
  const h = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
