"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import { OverviewView } from "@/components/dashboard/OverviewView";

export default function OverviewPage() {
  const state = useDemo();
  // Rendered only after hydration (see AppShell), so reading the clock is safe.
  const [now] = useState(() => Date.now());
  return <OverviewView state={state} now={now} today={new Date(now)} />;
}
