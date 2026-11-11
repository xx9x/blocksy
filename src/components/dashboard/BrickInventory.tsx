"use client";

import { BRICK_COLORS, COLOR_ORDER, SIZE_ORDER, type BrickColor, type BrickSize } from "@/lib/bricks";
import type { DemoState, EarnedBrick } from "@/lib/store";
import { IsoBrick } from "@/components/bricks/IsoBuild";

export interface InventoryGroup {
  key: string;
  color: BrickColor;
  size: BrickSize;
  available: EarnedBrick[];
  total: number;
}

export function groupInventory(s: DemoState): InventoryGroup[] {
  const placed = new Set(s.placements.map((p) => p.brickId));
  const map = new Map<string, InventoryGroup>();
  for (const b of s.bricks) {
    const key = `${b.size}:${b.color}`;
    const g = map.get(key) ?? { key, color: b.color, size: b.size, available: [], total: 0 };
    g.total++;
    if (!placed.has(b.id)) g.available.push(b);
    map.set(key, g);
  }
  return [...map.values()].sort(
    (a, b) =>
      COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color) ||
      SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
  );
}

/** Compact tally of bricks per color (dashboard + landing preview). */
export function BrickTally({ state }: { state: DemoState }) {
  const counts = COLOR_ORDER.map((c) => ({ c, n: state.bricks.filter((b) => b.color === c).length })).filter(
    (x) => x.n > 0,
  );
  if (!counts.length) return <p className="text-sm text-ink-soft">No bricks yet — complete an activity to earn your first.</p>;
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
      {counts.map(({ c, n }) => (
        <li
          key={c}
          className="flex items-center gap-2 rounded-2xl border border-line bg-white px-2.5 py-2"
          title={BRICK_COLORS[c].meaning}
        >
          <IsoBrick size="1x2" color={c} unit={11} className="h-6 w-7 shrink-0" />
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-lg font-semibold text-ink">{n}</span>
            <span className="block truncate text-[11px] font-bold text-ink-soft">{BRICK_COLORS[c].short}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Selectable inventory used by the builder. */
export function BrickInventory({
  groups,
  selected,
  onSelect,
}: {
  groups: InventoryGroup[];
  selected: string | null;
  onSelect: (key: string | null) => void;
}) {
  if (!groups.length)
    return <p className="text-sm text-ink-soft">Your inventory is empty. Complete activities to earn bricks.</p>;
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3" role="listbox" aria-label="Brick inventory">
      {groups.map((g) => {
        const active = selected === g.key;
        const empty = g.available.length === 0;
        return (
          <li key={g.key}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              disabled={empty}
              onClick={() => onSelect(active ? null : g.key)}
              className={`group relative flex w-full flex-col items-center gap-1 rounded-2xl border bg-white px-2 pt-3 pb-2 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 ${
                active ? "border-transparent shadow-lift" : "border-line"
              }`}
              style={active ? { boxShadow: `0 0 0 2.5px ${BRICK_COLORS[g.color].hex}, 0 12px 24px -14px ${BRICK_COLORS[g.color].hex}` } : undefined}
              aria-label={`${BRICK_COLORS[g.color].name} ${g.size} brick, ${g.available.length} available`}
            >
              <IsoBrick size={g.size} color={g.color} unit={12} className="h-9 w-auto max-w-full transition-transform group-hover:-translate-y-0.5" />
              <span className="text-[11px] font-extrabold text-ink">{g.size}</span>
              <span
                className="absolute top-1.5 right-1.5 min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5 font-extrabold"
                style={{ background: BRICK_COLORS[g.color].tint, color: BRICK_COLORS[g.color].ink }}
              >
                {g.available.length}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
