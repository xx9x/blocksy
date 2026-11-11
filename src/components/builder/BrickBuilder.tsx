"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Eraser,
  Grid3x3,
  Hand,
  Keyboard,
  Loader2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { BRICK_COLORS, footprint, shade } from "@/lib/bricks";
import { actions, BOARD_SIZE, MAX_LEVEL, placedBricks, resolvePlacement, useDemo } from "@/lib/store";
import { useWebGL } from "@/lib/webgl";
import { Button, Card } from "@/components/ui";
import { BrickInventory, groupInventory } from "@/components/dashboard/BrickInventory";
import type { GhostView, PlacedView } from "./BuilderCanvas";

const BuilderCanvas = dynamic(() => import("./BuilderCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm font-bold text-ink-soft">
      <span className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading 3D builder…
      </span>
    </div>
  ),
});

type Tool = "place" | "remove";

/** Top-down 2D builder: the WebGL fallback and an accessible precise mode. */
function TopView({
  placed,
  ghost,
  tool,
  cursor,
  onCell,
  onHover,
}: {
  placed: PlacedView[];
  ghost: GhostView | null;
  tool: Tool;
  cursor: [number, number] | null;
  onCell: (cell: [number, number]) => void;
  onHover: (cell: [number, number] | null) => void;
}) {
  // top-most brick per cell
  const top = useMemo(() => {
    const m = new Map<string, PlacedView>();
    for (const p of placed) {
      const [w, d] = footprint(p.size, p.rotated);
      for (let x = p.x; x < p.x + w; x++)
        for (let z = p.z; z < p.z + d; z++) {
          const k = `${x},${z}`;
          const cur = m.get(k);
          if (!cur || cur.level < p.level) m.set(k, p);
        }
    }
    return m;
  }, [placed]);

  const inGhost = (x: number, z: number) =>
    ghost && tool === "place" && x >= ghost.x && x < ghost.x + ghost.w && z >= ghost.z && z < ghost.z + ghost.d;

  return (
    <div className="grid h-full place-items-center p-3 sm:p-6">
      <div
        className="grid aspect-square w-full max-w-[520px] gap-[3px] rounded-2xl bg-[#E9ECF3] p-2"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
        onMouseLeave={() => onHover(null)}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
          const z = Math.floor(i / BOARD_SIZE);
          const x = i % BOARD_SIZE;
          const p = top.get(`${x},${z}`);
          const g = inGhost(x, z);
          const isCursor = cursor && cursor[0] === x && cursor[1] === z;
          const color = p ? BRICK_COLORS[p.color].hex : "#F7F8FB";
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden
              onMouseEnter={() => onHover([x, z])}
              onClick={() => onCell([x, z])}
              className="relative grid aspect-square place-items-center rounded-[5px] text-[10px] font-extrabold text-ink/60"
              style={{
                background: g ? (ghost!.ok ? BRICK_COLORS[ghost!.color].hex + "aa" : "#FF777Baa") : color,
                boxShadow: p ? `inset 0 -2px 0 ${shade(BRICK_COLORS[p.color].hex, -0.18)}` : "inset 0 -1px 0 #E1E4EC",
                outline: isCursor ? "2px solid #242424" : undefined,
                outlineOffset: -2,
              }}
            >
              <span
                className="absolute h-[46%] w-[46%] rounded-full"
                style={{ background: p ? shade(BRICK_COLORS[p.color].hex, 0.18) : "#EEF0F5", boxShadow: "0 1px 0 rgb(0 0 0 / .08)" }}
              />
              {p && <span className="relative">{p.level + 1}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BrickBuilder() {
  const state = useDemo();
  const webgl = useWebGL();
  const groups = useMemo(() => groupInventory(state), [state]);
  const placed = useMemo<PlacedView[]>(() => placedBricks(state), [state]);

  const [selected, setSelected] = useState<string | null>(null);
  const [rotated, setRotated] = useState(false);
  const [tool, setTool] = useState<Tool>("place");
  const [cursor, setCursor] = useState<[number, number] | null>([4, 5]);
  const [hoverBrick, setHoverBrick] = useState<string | null>(null);
  const [recentId, setRecentId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: "info" | "error" | "ok" } | null>(null);
  const [view, setView] = useState<"3d" | "top">("3d");
  const [confirmReset, setConfirmReset] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const group = groups.find((g) => g.key === selected) ?? null;
  const activeGroup = group && group.available.length > 0 ? group : null;
  const use3D = webgl !== false && view === "3d";

  const anchor = useCallback(
    (cell: [number, number]): [number, number] => {
      if (!activeGroup) return cell;
      const [w, d] = footprint(activeGroup.size, rotated);
      const x = Math.max(0, Math.min(BOARD_SIZE - w, cell[0] - Math.floor((w - 1) / 2)));
      const z = Math.max(0, Math.min(BOARD_SIZE - d, cell[1] - Math.floor((d - 1) / 2)));
      return [x, z];
    },
    [activeGroup, rotated],
  );

  const ghost: GhostView | null = useMemo(() => {
    if (!activeGroup || !cursor) return null;
    const [x, z] = anchor(cursor);
    const [w, d] = footprint(activeGroup.size, rotated);
    const r = resolvePlacement(state, activeGroup.size, x, z, rotated);
    return { x, z, w, d, level: r.level, color: activeGroup.color, ok: r.ok };
  }, [activeGroup, cursor, anchor, rotated, state]);

  const place = (cell: [number, number]) => {
    if (!activeGroup) {
      setMessage({ text: "Pick a brick from your inventory first.", tone: "info" });
      return;
    }
    const brick = activeGroup.available[0];
    const [x, z] = anchor(cell);
    const err = actions.placeBrick({ brickId: brick.id, x, z, level: 0, rotated });
    if (err) {
      setMessage({ text: err, tone: "error" });
      return;
    }
    setRecentId(brick.id);
    const lvl = resolvePlacement(state, brick.size, x, z, rotated).level;
    setMessage({
      text: `Snapped a ${BRICK_COLORS[brick.color].name.toLowerCase()} ${brick.size} onto level ${lvl + 1}.`,
      tone: "ok",
    });
  };

  const remove = (id: string) => {
    const err = actions.removeBrick(id);
    setMessage(err ? { text: err, tone: "error" } : { text: "Brick returned to your inventory.", tone: "info" });
    setHoverBrick(null);
  };

  const topBrickAt = (cell: [number, number]) => {
    let best: PlacedView | null = null;
    for (const p of placed) {
      const [w, d] = footprint(p.size, p.rotated);
      if (cell[0] >= p.x && cell[0] < p.x + w && cell[1] >= p.z && cell[1] < p.z + d) {
        if (!best || p.level > best.level) best = p;
      }
    }
    return best;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const c = cursor ?? [0, 0];
    const move = (dx: number, dz: number) => {
      e.preventDefault();
      setCursor([
        Math.max(0, Math.min(BOARD_SIZE - 1, c[0] + dx)),
        Math.max(0, Math.min(BOARD_SIZE - 1, c[1] + dz)),
      ]);
    };
    switch (e.key) {
      case "ArrowLeft":
        return move(-1, 0);
      case "ArrowRight":
        return move(1, 0);
      case "ArrowUp":
        return move(0, -1);
      case "ArrowDown":
        return move(0, 1);
      case "r":
      case "R":
        e.preventDefault();
        return setRotated((r) => !r);
      case "Enter":
      case " ":
        e.preventDefault();
        if (tool === "remove") {
          const b = topBrickAt(c);
          if (b) remove(b.brickId);
        } else place(c);
        return;
      case "Delete":
      case "Backspace": {
        e.preventDefault();
        const b = topBrickAt(c);
        if (b) remove(b.brickId);
        return;
      }
      case "Escape":
        setSelected(null);
        return;
    }
  };

  const onTopCell = (cell: [number, number]) => {
    setCursor(cell);
    if (tool === "remove") {
      const b = topBrickAt(cell);
      if (b) remove(b.brickId);
    } else place(cell);
  };

  const available = groups.reduce((a, g) => a + g.available.length, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card className="relative overflow-hidden">
        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <div className="flex rounded-full bg-mist p-1" role="radiogroup" aria-label="Tool">
            {(
              [
                ["place", "Place", Hand],
                ["remove", "Remove", Eraser],
              ] as const
            ).map(([t, label, Icon]) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tool === t}
                onClick={() => setTool(t)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
                  tool === t ? "bg-white text-ink shadow-soft" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setRotated((r) => !r)} aria-pressed={rotated} disabled={tool !== "place"}>
            <RotateCw className="h-4 w-4" /> Rotate <span className="hidden text-ink-soft sm:inline">(R)</span>
          </Button>
          {webgl !== false && (
            <div className="ml-auto flex rounded-full bg-mist p-1" role="radiogroup" aria-label="View">
              {(
                [
                  ["3d", "3D", Box],
                  ["top", "Top", Grid3x3],
                ] as const
              ).map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={view === v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                    view === v ? "bg-white text-ink shadow-soft" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="relative h-[380px] touch-pan-y bg-[radial-gradient(80%_70%_at_50%_40%,#ffffff_0%,#F3F5FA_100%)] outline-none focus-visible:ring-4 focus-visible:ring-sky/40 focus-visible:ring-inset sm:h-[540px]"
          aria-label={`Brick builder. ${placed.length} bricks placed. Use arrow keys to move the cursor, R to rotate, Enter to ${tool === "place" ? "place" : "remove"}, Delete to remove the top brick.`}
          role="application"
        >
          {use3D ? (
            <BuilderCanvas
              placed={placed}
              ghost={ghost}
              tool={tool}
              hoverBrick={hoverBrick}
              recentId={recentId}
              onHoverCell={(c) => c && setCursor(c)}
              onHoverBrick={setHoverBrick}
              onPlaceAt={(c) => {
                setCursor(c);
                place(c);
              }}
              onRemove={remove}
              onReady={() => setCanvasReady(true)}
            />
          ) : (
            <TopView placed={placed} ghost={ghost} tool={tool} cursor={cursor} onCell={onTopCell} onHover={(c) => c && setCursor(c)} />
          )}
          {use3D && !canvasReady && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm font-bold text-ink-soft">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading 3D builder…
              </span>
            </div>
          )}
          {webgl === false && (
            <p className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink-soft shadow-soft">
              3D isn&apos;t available in this browser — using the top-down builder.
            </p>
          )}
          {use3D && (
            <p className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink-soft shadow-soft sm:flex">
              <Keyboard className="h-3.5 w-3.5" /> Drag to orbit · scroll to zoom · arrows + Enter work too
            </p>
          )}
        </div>
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5">
          <p
            role="status"
            aria-live="polite"
            className={`text-sm font-bold ${
              message?.tone === "error" ? "text-coral-ink" : message?.tone === "ok" ? "text-mint-ink" : "text-ink-soft"
            }`}
          >
            {message?.text ??
              (activeGroup
                ? `Placing a ${BRICK_COLORS[activeGroup.color].name.toLowerCase()} ${activeGroup.size}${rotated ? " (rotated)" : ""}. Click a spot on the baseplate.`
                : tool === "remove"
                  ? "Click a brick to return it to your inventory."
                  : "Choose a brick from your inventory to start building.")}
          </p>
          <span className="text-xs font-bold text-ink-soft">
            {placed.length} placed · max {MAX_LEVEL} high
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Inventory</h2>
            <span className="text-xs font-bold text-ink-soft">{available} available</span>
          </div>
          <BrickInventory
            groups={groups}
            selected={selected}
            onSelect={(k) => {
              setSelected(k);
              setTool("place");
              setMessage(null);
            }}
          />
          <Link href="/app" className="mt-4 block rounded-2xl bg-mist p-3 text-center text-sm font-bold text-ink-soft hover:text-ink">
            Need more bricks? Complete an activity →
          </Link>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-ink">Build tools</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Bricks snap to the stud grid and stack on whatever is below them. You can only remove bricks with nothing on
            top. Your build saves automatically in this browser.
          </p>
          {!confirmReset ? (
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => setConfirmReset(true)} disabled={!placed.length}>
              <RotateCcw className="h-4 w-4" /> Reset build
            </Button>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-coral-ink">Return every brick to the inventory?</span>
              <Button
                size="sm"
                onClick={() => {
                  actions.resetBuild();
                  setConfirmReset(false);
                  setMessage({ text: "Build cleared. All bricks are back in your inventory.", tone: "info" });
                }}
              >
                Yes, reset
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
