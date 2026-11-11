"use client";

import { motion } from "motion/react";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { BRICK_COLORS } from "@/lib/bricks";
import { useDemo } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AchievementBadge } from "@/components/dashboard/AchievementBadge";
import { ProgressBar } from "@/components/ui";

export default function AchievementsPage() {
  const s = useDemo();
  const unlockedCount = ACHIEVEMENTS.filter((a) => s.achievements[a.id]).length;
  return (
    <>
      <PageHeader
        title="Achievements"
        badge={`${unlockedCount} of ${ACHIEVEMENTS.length} unlocked`}
        color="yellow"
        description="Little milestones for real progress. Each badge is built from bricks in the color of the skill it celebrates."
        bricks={[
          { x: 0, z: 0, level: 0, w: 2, d: 2, color: "yellow" },
          { x: 0, z: 0, level: 1, w: 2, d: 2, color: "orange" },
          { x: 0, z: 0, level: 2, w: 1, d: 1, color: "red" },
        ]}
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const at = s.achievements[a.id];
          const [cur, goal] = a.progress(s);
          const c = BRICK_COLORS[a.color];
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex flex-col items-center rounded-[28px] border bg-white p-6 text-center shadow-soft ${at ? "border-line" : "border-dashed border-line"}`}
            >
              <AchievementBadge achievement={a} unlocked={!!at} size="lg" />
              <h2 className="mt-4 text-xl font-semibold text-ink">{a.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{a.description}</p>
              <div className="mt-auto w-full pt-5">
                {at ? (
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: c.tint, color: c.ink }}>
                    Unlocked {new Date(at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                ) : (
                  <>
                    <ProgressBar value={(cur / goal) * 100} color={a.color} label={`${a.title} progress`} />
                    <p className="mt-1.5 text-xs font-bold text-ink-soft tabular-nums">
                      {cur} / {goal}
                    </p>
                  </>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}
