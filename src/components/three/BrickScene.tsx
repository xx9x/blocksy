"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { IsoBuild, type IsoBrickSpec } from "@/components/bricks/IsoBuild";
import { SHIELD } from "@/lib/shield";
import { useReducedMotion } from "@/lib/motion";
import { useInView, useWebGL } from "@/lib/webgl";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/** SVG version of the hero shield: the loading placeholder and WebGL fallback. */
const SHIELD_ISO: IsoBrickSpec[] = SHIELD.map((b) => ({
  x: b.x + 4,
  z: 0,
  level: b.row,
  w: b.len,
  d: 2,
  color: b.color,
  lift: b.anim && b.anim.phase > 0.2 ? 1.2 : 0,
}));

export function ShieldIllustration({ className }: { className?: string }) {
  return (
    <IsoBuild
      bricks={SHIELD_ISO}
      unit={30}
      className={className}
      title="A shield built from colorful interlocking bricks"
    />
  );
}

/**
 * The landing-page hero scene. Renders real-time 3D bricks when WebGL is
 * available, pauses when scrolled offscreen, respects reduced motion and
 * falls back to an isometric illustration.
 */
export function BrickScene({ className }: { className?: string }) {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [ready, setReady] = useState(false);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div
        className={`absolute inset-0 flex items-center justify-center p-[12%] transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={webgl ? true : undefined}
      >
        <ShieldIllustration className="h-full w-full max-w-[420px]" />
      </div>
      {webgl && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          role="img"
          aria-label="Interactive 3D shield made of colorful interlocking bricks, with a few bricks floating and snapping into place"
        >
          <HeroCanvas reduced={reduced} active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
