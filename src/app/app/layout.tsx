import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/AppShell";

/**
 * Dashboard content is read from this browser's localStorage, so pages render
 * after hydration (with a skeleton first). Opt out of instant-nav validation.
 */
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · blocksy." },
  robots: { index: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
