"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { BRICK_COLORS, COLOR_ORDER } from "@/lib/bricks";
import { dismissCelebration, useCelebrations, type Celebration } from "@/lib/store";
import { IsoBrick } from "@/components/bricks/IsoBuild";
import { AchievementBadge } from "@/components/dashboard/AchievementBadge";

const CONFETTI = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI * 2 + 0.3,
  dist: 46 + (i % 3) * 14,
  color: BRICK_COLORS[COLOR_ORDER[i % COLOR_ORDER.length]].hex,
  size: 6 + (i % 2) * 3,
}));

function StudBurst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{ width: c.size, height: c.size, background: c.color, boxShadow: "inset 0 -1.5px 0 rgb(0 0 0 / .15)" }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos(c.angle) * c.dist,
            y: Math.sin(c.angle) * c.dist,
            scale: [0, 1, 0.6],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.15, 0.7, 0.3, 1] }}
        />
      ))}
    </span>
  );
}

function Toast({ c }: { c: Celebration }) {
  useEffect(() => {
    const t = setTimeout(() => dismissCelebration(c.id), c.kind === "achievement" ? 5200 : 3400);
    return () => clearTimeout(t);
  }, [c]);

  if (c.kind === "brick") {
    const col = BRICK_COLORS[c.brick.color];
    return (
      <div className="flex items-center gap-3.5 rounded-3xl border border-line bg-white py-3 pr-3 pl-3 shadow-lift">
        <span className="relative grid h-14 w-16 place-items-center rounded-2xl" style={{ background: col.tint }}>
          <StudBurst />
          <motion.span
            initial={{ y: -38, opacity: 0, rotate: -8 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scaleY: [1, 1, 0.9, 1], scaleX: [1, 1, 1.06, 1] }}
            transition={{ duration: 0.55, times: [0, 0.6, 0.78, 1], ease: [0.4, 0, 0.6, 1] }}
            className="block"
          >
            <IsoBrick size={c.brick.size} color={c.brick.color} unit={13} className="h-10 w-auto" />
          </motion.span>
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-xs font-extrabold" style={{ color: col.ink }}>
            +1 {col.name} · {c.brick.size}
          </span>
          <span className="mt-0.5 block text-sm font-bold text-ink">{c.brick.source}</span>
          <span className="mt-0.5 block text-xs font-semibold text-ink-soft">Added to your inventory</span>
        </span>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center self-start rounded-full text-ink-soft hover:bg-mist"
          aria-label="Dismiss"
          onClick={() => dismissCelebration(c.id)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const a = c.achievement;
  const col = BRICK_COLORS[a.color];
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-lift"
      style={{ backgroundImage: `radial-gradient(120% 80% at 0% 0%, ${col.tint}, #fff 60%)` }}
    >
      <div className="flex items-center gap-4">
        <motion.span
          className="relative"
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 16 }}
        >
          <StudBurst />
          <AchievementBadge achievement={a} unlocked size="md" />
        </motion.span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-extrabold tracking-wide uppercase" style={{ color: col.ink }}>
            Achievement unlocked
          </span>
          <span className="mt-0.5 block font-display text-xl font-semibold text-ink">{a.title}</span>
          <span className="block text-sm text-ink-soft">{a.description}</span>
        </span>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center self-start rounded-full text-ink-soft hover:bg-mist"
          aria-label="Dismiss"
          onClick={() => dismissCelebration(c.id)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function CelebrationLayer() {
  const list = useCelebrations();
  return (
    <div
      className="pointer-events-none fixed inset-x-3 bottom-3 z-[60] flex flex-col items-end gap-2.5 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[380px]"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {list.map((c) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto w-full"
          >
            <Toast c={c} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
