import { Lock } from "lucide-react";
import { BRICK_COLORS } from "@/lib/bricks";
import type { Achievement } from "@/lib/achievements";
import { IsoBuild } from "@/components/bricks/IsoBuild";

const BADGE_BUILDS: Record<string, { w: number; d: number; x: number; z: number; level: number }[]> = {
  "first-brick": [{ x: 0, z: 0, level: 0, w: 2, d: 2 }],
  "password-pro": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 0, z: 0, level: 1, w: 2, d: 1 },
  ],
  "phish-finder": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 1, z: 1, level: 1, w: 1, d: 1 },
  ],
  "mfa-master": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 0, z: 0, level: 1, w: 2, d: 2 },
  ],
  "privacy-builder": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 0, z: 1, level: 1, w: 2, d: 1 },
  ],
  "breach-ready": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 0, z: 0, level: 1, w: 1, d: 1 },
    { x: 1, z: 1, level: 1, w: 1, d: 1 },
  ],
  "habit-streak": [
    { x: 0, z: 0, level: 0, w: 1, d: 1 },
    { x: 1, z: 0, level: 0, w: 1, d: 1 },
    { x: 0, z: 1, level: 0, w: 2, d: 1 },
    { x: 0, z: 0, level: 1, w: 2, d: 1 },
  ],
  "first-build": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 0, z: 0, level: 1, w: 1, d: 2 },
    { x: 0, z: 0, level: 2, w: 1, d: 1 },
  ],
  "master-builder": [
    { x: 0, z: 0, level: 0, w: 2, d: 2 },
    { x: 0, z: 0, level: 1, w: 2, d: 2 },
    { x: 0, z: 0, level: 2, w: 2, d: 2 },
  ],
};

export function AchievementBadge({
  achievement,
  unlocked,
  size = "md",
}: {
  achievement: Achievement;
  unlocked: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const c = BRICK_COLORS[achievement.color];
  const dims = { sm: "h-14 w-14", md: "h-20 w-20", lg: "h-28 w-28" }[size];
  const unit = { sm: 9, md: 13, lg: 18 }[size];
  const build = (BADGE_BUILDS[achievement.id] ?? BADGE_BUILDS["first-brick"]).map((b) => ({
    ...b,
    color: achievement.color,
  }));
  return (
    <div
      className={`relative grid ${dims} shrink-0 place-items-center rounded-[30%] ${unlocked ? "" : "grayscale"}`}
      style={{
        background: unlocked
          ? `radial-gradient(circle at 30% 25%, #fff 0%, ${c.tint} 55%, ${c.hex}55 100%)`
          : "#F3F4F7",
        boxShadow: unlocked
          ? `inset 0 -4px 0 ${c.hex}55, inset 0 0 0 2px ${c.hex}66, 0 10px 20px -12px ${c.hex}`
          : "inset 0 0 0 2px #E8E8E8",
      }}
      aria-hidden
    >
      <IsoBuild bricks={build} unit={unit} className={`w-[62%] ${unlocked ? "" : "opacity-40"}`} pad={1} />
      {!unlocked && (
        <span className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full border border-line bg-white text-ink-soft">
          <Lock className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}
