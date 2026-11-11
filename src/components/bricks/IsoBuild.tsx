import { useId } from "react";
import {
  BRICK_COLORS,
  BRICK_HEIGHT,
  STUD_HEIGHT,
  STUD_RADIUS,
  footprint,
  shade,
  type BrickColor,
  type BrickSize,
} from "@/lib/bricks";

/**
 * Isometric SVG renderer for brick structures. Lightweight (no WebGL), so it
 * powers small illustrations, badges, inventory tiles, the dashboard build
 * preview and the WebGL fallback.
 *
 * Bricks are decomposed into stud cells and painted level by level, back to
 * front. Because the view looks down, anything on a higher level can only
 * cover lower levels — so this ordering is always correct for stacked bricks.
 */

export interface IsoBrickSpec {
  x: number;
  z: number;
  level: number;
  /** footprint along x */
  w: number;
  /** footprint along z */
  d: number;
  color: BrickColor;
  /** Optional vertical lift in brick heights (for floating bricks). */
  lift?: number;
  opacity?: number;
}

const C = Math.cos(Math.PI / 6);
const GAP = 0.035;

interface Props {
  bricks: IsoBrickSpec[];
  /** pixels per stud */
  unit?: number;
  className?: string;
  title?: string;
  /** extra padding in px */
  pad?: number;
}

export function IsoBuild({ bricks, unit = 22, className, title, pad = 6 }: Props) {
  const uid = useId().replace(/:/g, "");
  const s = unit;
  const H = BRICK_HEIGHT;
  const iso = (x: number, z: number, y: number): [number, number] => [
    (x - z) * C * s,
    (x + z) * 0.5 * s - y * s,
  ];

  type Cell = {
    key: string;
    cx: number;
    cz: number;
    level: number;
    y0: number;
    b: IsoBrickSpec;
  };
  const cells: Cell[] = [];
  bricks.forEach((b, bi) => {
    const y0 = (b.level + (b.lift ?? 0)) * H;
    for (let i = 0; i < b.w; i++)
      for (let j = 0; j < b.d; j++)
        cells.push({ key: `${bi}-${i}-${j}`, cx: b.x + i, cz: b.z + j, level: b.level + (b.lift ?? 0), y0, b });
  });
  cells.sort((a, b) => a.level - b.level || a.cx + a.cz - (b.cx + b.cz) || a.cx - b.cx);

  // Bounds
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const c of cells) {
    for (const [x, z, y] of [
      [c.cx, c.cz, c.y0 + H + STUD_HEIGHT],
      [c.cx + 1, c.cz, c.y0],
      [c.cx, c.cz + 1, c.y0],
      [c.cx + 1, c.cz + 1, c.y0],
      [c.cx + 1, c.cz, c.y0 + H + STUD_HEIGHT],
      [c.cx, c.cz + 1, c.y0 + H + STUD_HEIGHT],
    ] as const) {
      const [px, py] = iso(x, z, y);
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px);
      minY = Math.min(minY, py);
      maxY = Math.max(maxY, py);
    }
  }
  if (!cells.length) {
    minX = minY = 0;
    maxX = maxY = 10;
  }
  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2];

  const colorsUsed = Array.from(new Set(bricks.map((b) => b.color)));
  const pts = (p: [number, number][]) => p.map((q) => q.map((v) => v.toFixed(2)).join(",")).join(" ");

  const rx = s * C * STUD_RADIUS * Math.SQRT2;
  const ry = s * 0.5 * STUD_RADIUS * Math.SQRT2;
  const sh = STUD_HEIGHT * s;

  return (
    <svg
      viewBox={vb.join(" ")}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        {colorsUsed.map((c) => {
          const hex = BRICK_COLORS[c].hex;
          return (
            <g key={c}>
              <linearGradient id={`${uid}-top-${c}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={shade(hex, 0.34)} />
                <stop offset="1" stopColor={shade(hex, 0.1)} />
              </linearGradient>
              <linearGradient id={`${uid}-left-${c}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={shade(hex, 0.04)} />
                <stop offset="1" stopColor={shade(hex, -0.06)} />
              </linearGradient>
              <linearGradient id={`${uid}-right-${c}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={shade(hex, -0.12)} />
                <stop offset="1" stopColor={shade(hex, -0.22)} />
              </linearGradient>
              <linearGradient id={`${uid}-stud-${c}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={shade(hex, 0.12)} />
                <stop offset="0.55" stopColor={shade(hex, -0.02)} />
                <stop offset="1" stopColor={shade(hex, -0.2)} />
              </linearGradient>
            </g>
          );
        })}
      </defs>
      {cells.map(({ key, cx, cz, y0, b }) => {
        const y1 = y0 + H;
        const x0 = cx === b.x ? cx + GAP : cx;
        const x1 = cx + 1 === b.x + b.w ? cx + 1 - GAP : cx + 1;
        const z0 = cz === b.z ? cz + GAP : cz;
        const z1 = cz + 1 === b.z + b.d ? cz + 1 - GAP : cz + 1;
        const yb = y0 + 0.02;
        const frontZ = cz + 1 === b.z + b.d;
        const frontX = cx + 1 === b.x + b.w;
        const hex = BRICK_COLORS[b.color].hex;
        const [sx, sy] = iso(cx + 0.5, cz + 0.5, y1);
        return (
          <g key={key} opacity={b.opacity}>
            <polygon
              points={pts([iso(x0, z0, y1), iso(x1, z0, y1), iso(x1, z1, y1), iso(x0, z1, y1)])}
              fill={`url(#${uid}-top-${b.color})`}
              stroke={`url(#${uid}-top-${b.color})`}
              strokeWidth={0.6}
              strokeLinejoin="round"
            />
            {frontZ && (
              <>
                <polygon
                  points={pts([iso(x0, z1, y1), iso(x1, z1, y1), iso(x1, z1, yb), iso(x0, z1, yb)])}
                  fill={`url(#${uid}-left-${b.color})`}
                  stroke={`url(#${uid}-left-${b.color})`}
                  strokeWidth={0.6}
                  strokeLinejoin="round"
                />
                <line
                  x1={iso(x0, z1, y1)[0]}
                  y1={iso(x0, z1, y1)[1]}
                  x2={iso(x1, z1, y1)[0]}
                  y2={iso(x1, z1, y1)[1]}
                  stroke="#fff"
                  strokeOpacity={0.55}
                  strokeWidth={Math.max(0.6, s * 0.04)}
                  strokeLinecap="round"
                />
              </>
            )}
            {frontX && (
              <>
                <polygon
                  points={pts([iso(x1, z0, y1), iso(x1, z1, y1), iso(x1, z1, yb), iso(x1, z0, yb)])}
                  fill={`url(#${uid}-right-${b.color})`}
                  stroke={`url(#${uid}-right-${b.color})`}
                  strokeWidth={0.6}
                  strokeLinejoin="round"
                />
                <line
                  x1={iso(x1, z0, y1)[0]}
                  y1={iso(x1, z0, y1)[1]}
                  x2={iso(x1, z1, y1)[0]}
                  y2={iso(x1, z1, y1)[1]}
                  stroke="#fff"
                  strokeOpacity={0.35}
                  strokeWidth={Math.max(0.5, s * 0.03)}
                  strokeLinecap="round"
                />
              </>
            )}
            {frontX && frontZ && (
              <line
                x1={iso(x1, z1, y1)[0]}
                y1={iso(x1, z1, y1)[1]}
                x2={iso(x1, z1, yb)[0]}
                y2={iso(x1, z1, yb)[1]}
                stroke="#fff"
                strokeOpacity={0.3}
                strokeWidth={Math.max(0.5, s * 0.03)}
                strokeLinecap="round"
              />
            )}
            {/* stud */}
            <ellipse cx={sx} cy={sy} rx={rx} ry={ry} fill={shade(hex, -0.18)} opacity={0.55} />
            <rect x={sx - rx} y={sy - sh} width={rx * 2} height={sh} fill={`url(#${uid}-stud-${b.color})`} />
            <ellipse cx={sx} cy={sy} rx={rx} ry={ry} fill={`url(#${uid}-stud-${b.color})`} />
            <ellipse cx={sx} cy={sy - sh} rx={rx} ry={ry} fill={shade(hex, 0.26)} />
            <ellipse
              cx={sx - rx * 0.28}
              cy={sy - sh - ry * 0.22}
              rx={rx * 0.42}
              ry={ry * 0.32}
              fill="#fff"
              opacity={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** A single brick, handy for icons, inventory tiles and badges. */
export function IsoBrick({
  size,
  color,
  rotated,
  unit = 18,
  className,
  title,
}: {
  size: BrickSize;
  color: BrickColor;
  rotated?: boolean;
  unit?: number;
  className?: string;
  title?: string;
}) {
  const [w, d] = footprint(size, rotated);
  return (
    <IsoBuild
      bricks={[{ x: 0, z: 0, level: 0, w, d, color }]}
      unit={unit}
      className={className}
      title={title}
      pad={2}
    />
  );
}
