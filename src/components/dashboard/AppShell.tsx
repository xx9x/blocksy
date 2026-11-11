"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, LogOut, Menu, X } from "lucide-react";
import { actions, useDemo, useHydrated } from "@/lib/store";
import { Logo } from "@/components/brand/Logo";
import { IsoBuild } from "@/components/bricks/IsoBuild";
import { Button } from "@/components/ui";
import { DashboardSidebar, SidebarNav } from "./DashboardSidebar";

function DemoGate() {
  const [name, setName] = useState("");
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="w-full max-w-md rounded-[32px] border border-line bg-white p-8 text-center shadow-lift">
        <IsoBuild
          bricks={[
            { x: 0, z: 0, level: 0, w: 4, d: 2, color: "teal" },
            { x: 1, z: 0, level: 1, w: 2, d: 2, color: "yellow" },
            { x: 0, z: 0, level: 1, w: 1, d: 1, color: "blue" },
          ]}
          unit={26}
          className="mx-auto h-28 w-auto drop-shadow-[0_14px_14px_rgb(36_36_36/0.14)]"
        />
        <h1 className="mt-5 text-3xl font-semibold text-ink">Start your demo build</h1>
        <p className="mt-2 text-ink-soft">
          Explore every lesson and the brick builder without an account. Your progress is saved only in this
          browser.
        </p>
        <form
          className="mt-6 flex flex-col gap-3 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            actions.startDemo(name || "Builder");
          }}
        >
          <label htmlFor="demo-name" className="text-sm font-bold text-ink">
            What should we call you? <span className="font-semibold text-ink-soft">(optional)</span>
          </label>
          <input
            id="demo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Builder"
            autoComplete="nickname"
            className="h-12 rounded-2xl border border-line bg-white px-4 text-base outline-none focus:border-sky focus:ring-4 focus:ring-sky/20"
          />
          <Button type="submit" size="lg" className="mt-1">
            Enter demo mode <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-4 text-sm text-ink-soft">
          You&apos;ll get a starter kit of 3 teal foundation bricks.{" "}
          <Link href="/signup" className="font-bold text-sky-ink hover:underline">
            About accounts
          </Link>
        </p>
      </div>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-2" aria-busy="true" aria-label="Loading your progress">
      <div className="h-10 w-64 animate-pulse rounded-2xl bg-mist" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-mist" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-3xl bg-mist" />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useDemo((s) => s.profile);
  const [open, setOpen] = useState(false);
  const name = profile?.name ?? "Builder";

  const signOut = (
    <button
      type="button"
      onClick={() => {
        actions.signOut();
        router.push("/");
      }}
      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-mist hover:text-ink"
    >
      <LogOut className="h-3.5 w-3.5" /> Leave demo
    </button>
  );

  return (
    <div className="min-h-dvh bg-mist/60">
      <a
        href="#app-main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-line bg-white lg:block">
        <DashboardSidebar active={pathname} name={hydrated ? name : "…"} footer={profile ? signOut : null} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur-xl lg:hidden">
        <Logo href="/" size="sm" />
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white"
          aria-expanded={open}
          aria-controls="app-mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="app-mobile-nav"
              aria-label="Dashboard"
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col gap-4 overflow-y-auto bg-white px-4 py-5 shadow-lift lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              <div className="flex items-center justify-between px-2">
                <Logo href="/" size="sm" />
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarNav active={pathname} onNavigate={() => setOpen(false)} />
              {profile && <div className="mt-auto px-1">{signOut}</div>}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <main id="app-main" className="lg:pl-[248px]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          {!hydrated ? (
            <ShellSkeleton />
          ) : !profile ? (
            <DemoGate />
          ) : (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
