import { Logo } from "@/components/brand/Logo";
import { IsoBuild } from "@/components/bricks/IsoBuild";
import { SAMPLE_CASTLE, toIso } from "@/lib/sample";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-10">{children}</main>
        <p className="text-center text-xs text-ink-soft">
          An educational demo. No real accounts are created and passwords are never stored.
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-mist lg:block" aria-hidden>
        <div className="stud-dots absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,#ffffff_0%,transparent_100%)]" />
        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <IsoBuild bricks={toIso(SAMPLE_CASTLE)} unit={34} className="w-full max-w-[520px] drop-shadow-[0_30px_30px_rgb(36_36_36/0.16)]" />
          <p className="mt-10 max-w-sm text-center font-display text-3xl leading-tight font-semibold text-ink">
            Every lesson is a brick. Every brick makes you safer.
          </p>
        </div>
      </aside>
    </div>
  );
}
