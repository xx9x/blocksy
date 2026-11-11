"use client";

import { useSyncExternalStore } from "react";
import { useDemo } from "./store";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/** Combines the OS setting with the in-app Settings override. */
export function useReducedMotion(): boolean {
  const system = useSystemReducedMotion();
  const pref = useDemo((s) => s.settings.motion);
  if (pref === "reduced") return true;
  if (pref === "full") return false;
  return system;
}
