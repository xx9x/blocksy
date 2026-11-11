"use client";

import { MotionConfig } from "motion/react";
import { useReducedMotion } from "@/lib/motion";
import { CelebrationLayer } from "@/components/rewards/CelebrationLayer";

export function Providers({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      {children}
      <CelebrationLayer />
    </MotionConfig>
  );
}
