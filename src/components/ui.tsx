import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { BRICK_COLORS, type BrickColor } from "@/lib/bricks";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold whitespace-nowrap select-none transition-[transform,box-shadow,background-color,border-color,color] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_8px_20px_-8px_rgb(36_36_36/0.55)] hover:-translate-y-0.5 hover:bg-[#333] hover:shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_14px_26px_-10px_rgb(36_36_36/0.55)]",
  secondary:
    "bg-white text-ink border border-line hover:-translate-y-0.5 hover:border-[#d4d4d4] hover:shadow-soft",
  ghost: "text-ink hover:bg-mist",
  accent:
    "bg-sky text-[#0d2d4d] shadow-[inset_0_-3px_0_rgb(0_0_0/0.12)] hover:-translate-y-0.5 hover:brightness-[1.04]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function Pill({
  color = "blue",
  children,
  className = "",
}: {
  color?: BrickColor;
  children: ReactNode;
  className?: string;
}) {
  const c = BRICK_COLORS[color];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
      style={{ background: c.tint, color: c.ink }}
    >
      {children}
    </span>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-3xl border border-line bg-white shadow-soft ${className}`} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  color = "blue",
  align = "center",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  color?: BrickColor;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <div className={`mx-auto max-w-2xl ${align === "center" ? "text-center" : ""}`}>
      <Pill color={color}>{eyebrow}</Pill>
      <h2 id={id} className="mt-4 text-[2.1rem] leading-[1.08] font-semibold text-balance text-ink sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{sub}</p>}
    </div>
  );
}

/** Rounded progress bar with a brick-colored fill. */
export function ProgressBar({
  value,
  color = "blue",
  label,
  className = "",
}: {
  value: number;
  color?: BrickColor;
  label?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-mist ring-1 ring-line ring-inset ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={label}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${v}%`,
          background: `linear-gradient(180deg, ${BRICK_COLORS[color].hex}, ${BRICK_COLORS[color].hex}dd)`,
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.45)",
        }}
      />
    </div>
  );
}

export function DemoNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-2xl border border-dashed border-line bg-mist px-3.5 py-2.5 text-[13px] leading-snug text-ink-soft ${className}`}
    >
      <span className="mt-[3px] inline-block h-2 w-2 shrink-0 rounded-full bg-sun ring-2 ring-sun/30" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
