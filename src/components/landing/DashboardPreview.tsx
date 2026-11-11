"use client";

import { useMemo } from "react";
import { SAMPLE_TODAY, sampleState } from "@/lib/sample";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OverviewView } from "@/components/dashboard/OverviewView";

/**
 * The landing-page dashboard preview renders the real dashboard components
 * with a sample builder's progress, inside a browser-style frame.
 */
export function DashboardPreview() {
  const state = useMemo(() => sampleState(), []);
  const now = state.activity[0].at + 60_000;
  return (
    <figure className="relative mx-auto mt-14 max-w-6xl">
      <div className="absolute -inset-x-6 -top-6 -bottom-10 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_30%,#ffffff_0%,transparent_100%)]" aria-hidden />
      <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_2px_4px_rgb(36_36_36/0.04),0_40px_80px_-40px_rgb(36_36_36/0.35)]">
        <div className="flex items-center gap-2 border-b border-line bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-coral" />
          <span className="h-3 w-3 rounded-full bg-sun" />
          <span className="h-3 w-3 rounded-full bg-mint" />
          <span className="mx-auto hidden rounded-full bg-mist px-4 py-1 text-xs font-bold text-ink-soft sm:block">
            blocksy · Overview
          </span>
          <span className="w-12" />
        </div>
        <div inert className="grid select-none lg:grid-cols-[232px_1fr]" aria-label="Preview of the Blocksy dashboard with sample data">
          <aside className="hidden border-r border-line bg-mist/60 lg:block">
            <DashboardSidebar active="/app" name="Alex" interactive={false} />
          </aside>
          <div className="bg-mist/40 p-4 sm:p-6">
            <OverviewView state={state} preview now={now} today={SAMPLE_TODAY} />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-sm text-ink-soft">Sample progress shown. Your own dashboard starts empty.</figcaption>
    </figure>
  );
}
