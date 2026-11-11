"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

let webglCache: boolean | null = null;

function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

const noop = () => () => {};

/** null during SSR / before hydration, then true/false. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(noop, detectWebGL, () => null);
}

/** Tracks whether an element is near the viewport (pauses offscreen 3D). */
export function useInView<T extends Element>(rootMargin = "100px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}
