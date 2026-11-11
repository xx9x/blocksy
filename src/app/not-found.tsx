import { IsoBuild } from "@/components/bricks/IsoBuild";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <Logo className="mb-10" />
        <IsoBuild
          bricks={[
            { x: 0, z: 0, level: 0, w: 4, d: 2, color: "red" },
            { x: 1, z: 0, level: 1, w: 2, d: 2, color: "yellow", lift: 0.6 },
          ]}
          unit={30}
          className="mx-auto h-36 w-auto drop-shadow-[0_18px_18px_rgb(36_36_36/0.14)]"
        />
        <h1 className="mt-8 text-4xl font-semibold text-ink">This brick doesn&apos;t fit</h1>
        <p className="mt-2 text-ink-soft">We couldn&apos;t find that page.</p>
        <ButtonLink href="/" className="mt-6">
          Back to Blocksy
        </ButtonLink>
      </div>
    </main>
  );
}
