"use client";

import Link from "next/link";
import { BRICK_COLORS } from "@/lib/bricks";
import { Logo } from "@/components/brand/Logo";
import { DASHBOARD_NAV } from "./nav";

export function SidebarNav({
  active,
  onNavigate,
  interactive = true,
}: {
  active: string;
  onNavigate?: () => void;
  interactive?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {DASHBOARD_NAV.map((item) => {
        const isActive = item.href === "/app" ? active === "/app" : active.startsWith(item.href);
        const c = BRICK_COLORS[item.color];
        const Icon = item.icon;
        const inner = (
          <>
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition-colors"
              style={isActive ? { background: c.hex, color: "#fff", boxShadow: "inset 0 -2px 0 rgb(0 0 0 / .12)" } : { background: c.tint, color: c.ink }}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="truncate">{item.label}</span>
          </>
        );
        const cls = `flex items-center gap-3 rounded-2xl px-2.5 py-2 text-[14.5px] font-bold transition-colors ${
          isActive ? "bg-mist text-ink" : "text-ink-soft hover:bg-mist hover:text-ink"
        }`;
        return (
          <li key={item.href}>
            {interactive ? (
              <Link href={item.href} className={cls} aria-current={isActive ? "page" : undefined} onClick={onNavigate}>
                {inner}
              </Link>
            ) : (
              <span className={cls}>{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardSidebar({
  active,
  name,
  interactive = true,
  footer,
}: {
  active: string;
  name: string;
  interactive?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <div className="px-2">
        {interactive ? <Logo href="/" size="sm" /> : <Logo href="/" size="sm" className="pointer-events-none" />}
      </div>
      <nav aria-label="Dashboard" className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
        <SidebarNav active={active} interactive={interactive} />
      </nav>
      <div className="rounded-2xl border border-line bg-white p-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-sun font-display text-base font-semibold text-ink">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-extrabold text-ink">{name}</span>
            <span className="block text-xs font-bold text-ink-soft">Demo mode · saved locally</span>
          </span>
        </div>
        {footer}
      </div>
    </div>
  );
}
