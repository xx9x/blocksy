import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRICK_COLORS } from "@/lib/bricks";
import type { FeatureInfo } from "@/lib/features";
import { IsoBuild, type IsoBrickSpec } from "@/components/bricks/IsoBuild";
import { FeatureIcon } from "@/components/FeatureIcon";

const STACKS: Record<string, (c: FeatureInfo["color"]) => IsoBrickSpec[]> = {
  password: (c) => [
    { x: 0, z: 0, level: 0, w: 4, d: 2, color: c },
    { x: 1, z: 0, level: 1, w: 2, d: 2, color: c },
  ],
  mfa: (c) => [
    { x: 0, z: 0, level: 0, w: 2, d: 2, color: c },
    { x: 2, z: 0, level: 0, w: 2, d: 2, color: "teal" },
    { x: 1, z: 0, level: 1, w: 2, d: 2, color: c },
  ],
  phishing: (c) => [
    { x: 0, z: 0, level: 0, w: 4, d: 2, color: c },
    { x: 0, z: 0, level: 1, w: 1, d: 2, color: c },
    { x: 3, z: 1, level: 1, w: 1, d: 1, color: "orange" },
  ],
  privacy: (c) => [
    { x: 0, z: 0, level: 0, w: 2, d: 4, color: c },
    { x: 0, z: 1, level: 1, w: 2, d: 2, color: c },
  ],
  breach: (c) => [
    { x: 0, z: 0, level: 0, w: 4, d: 2, color: c },
    { x: 2, z: 0, level: 1, w: 2, d: 1, color: "yellow" },
  ],
  habits: (c) => [
    { x: 0, z: 0, level: 0, w: 1, d: 1, color: c },
    { x: 1, z: 0, level: 0, w: 1, d: 1, color: c },
    { x: 2, z: 0, level: 0, w: 1, d: 1, color: c },
    { x: 1, z: 0, level: 1, w: 2, d: 1, color: c },
  ],
};

export function FeatureCard({ f, index }: { f: FeatureInfo; index: number }) {
  const c = BRICK_COLORS[f.color];
  return (
    <Link
      href={f.href}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1"
      style={{ ["--accent" as string]: c.hex }}
    >
      <div
        className="relative -mx-6 -mt-6 mb-5 flex h-40 items-end justify-center overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${c.tint}, #fff)` }}
      >
        <div className="stud-dots absolute inset-0 opacity-70" aria-hidden />
        <IsoBuild
          bricks={STACKS[f.id](f.color)}
          unit={24}
          className="relative mb-4 h-28 w-auto drop-shadow-[0_12px_14px_rgb(36_36_36/0.14)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2 group-hover:-rotate-2"
        />
        <span className="absolute top-4 left-5 font-display text-sm font-semibold text-ink-soft/70">
          0{index + 1}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ background: c.tint, color: c.ink }}
        >
          <FeatureIcon icon={f.icon} className="h-5 w-5" />
        </span>
        <h3 className="text-[1.4rem] font-semibold text-ink">{f.title}</h3>
      </div>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{f.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors"
          style={{ background: c.tint, color: c.ink }}
        >
          {f.action}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <span className="text-xs font-bold text-ink-soft">Earn {f.reward.toLowerCase()}</span>
      </div>
    </Link>
  );
}
