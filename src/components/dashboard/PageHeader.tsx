import { BRICK_COLORS, type BrickColor } from "@/lib/bricks";
import { IsoBuild, type IsoBrickSpec } from "@/components/bricks/IsoBuild";

export function PageHeader({
  title,
  description,
  color,
  bricks,
  badge,
  children,
}: {
  title: string;
  description: string;
  color: BrickColor;
  bricks?: IsoBrickSpec[];
  badge?: string;
  children?: React.ReactNode;
}) {
  const c = BRICK_COLORS[color];
  return (
    <header
      className="relative mb-6 overflow-hidden rounded-[28px] border border-line p-6 sm:p-8"
      style={{ background: `linear-gradient(120deg, ${c.tint} 0%, #fff 70%)` }}
    >
      <div className="stud-dots absolute inset-0 opacity-50" aria-hidden />
      <div className="relative flex items-center gap-6">
        <div className="min-w-0 flex-1">
          {badge && (
            <span
              className="inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-extrabold shadow-soft"
              style={{ color: c.ink }}
            >
              {badge}
            </span>
          )}
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-[2.5rem] sm:leading-[1.1]">{title}</h1>
          <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">{description}</p>
          {children}
        </div>
        {bricks && (
          <IsoBuild
            bricks={bricks}
            unit={26}
            className="hidden h-32 w-auto shrink-0 drop-shadow-[0_16px_16px_rgb(36_36_36/0.14)] sm:block"
          />
        )}
      </div>
    </header>
  );
}
