import { Navbar } from "./Navbar";
import { Footer } from "./Sections";
import { Pill } from "@/components/ui";
import type { BrickColor } from "@/lib/bricks";

export function InfoPage({
  eyebrow,
  title,
  intro,
  color,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  color: BrickColor;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <Pill color={color}>{eyebrow}</Pill>
        <h1 className="mt-4 text-4xl leading-tight font-semibold text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>
        <div className="mt-10 flex flex-col gap-8 text-[16px] leading-relaxed text-ink [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-ink-soft [&_li]:text-ink-soft [&_ul]:mt-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
