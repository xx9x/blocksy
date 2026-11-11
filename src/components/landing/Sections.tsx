import Link from "next/link";
import { ArrowRight, BookOpenCheck, Gift, Hammer, HeartHandshake, Laptop, ShieldCheck, Sparkles } from "lucide-react";
import { FEATURES } from "@/lib/features";
import { SAMPLE_BRIDGE, SAMPLE_CASTLE, SAMPLE_TOWER, toIso } from "@/lib/sample";
import { IsoBuild } from "@/components/bricks/IsoBuild";
import { BrickMark } from "@/components/brand/Logo";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { FeatureCard } from "./FeatureCard";
import { DashboardPreview } from "./DashboardPreview";

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 bg-mist py-20 sm:py-28" aria-labelledby="features-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="features-title"
          eyebrow="Six ways to build"
          color="blue"
          title="Everything you need to stay safer online"
          sub="Short, hands-on activities for the things that matter most. Each one earns bricks in its own color."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: 1,
    title: "Learn",
    text: "Explore bite-sized cybersecurity lessons and interactive security checks.",
    icon: BookOpenCheck,
    color: "#69B9FF",
    tint: "#EEF7FF",
    bricks: [{ x: 0, z: 0, level: 0, w: 2, d: 2, color: "blue" as const }],
  },
  {
    n: 2,
    title: "Earn",
    text: "Complete activities and unlock colorful building bricks.",
    icon: Gift,
    color: "#FFD45C",
    tint: "#FFF8E3",
    bricks: [
      { x: 0, z: 0, level: 0, w: 2, d: 2, color: "yellow" as const },
      { x: 2.6, z: 0.4, level: 0, w: 2, d: 1, color: "green" as const, lift: 0.9 },
      { x: -0.4, z: 2.4, level: 0, w: 1, d: 1, color: "red" as const, lift: 1.5 },
    ],
  },
  {
    n: 3,
    title: "Build",
    text: "Use your earned bricks to create your own digital security structure.",
    icon: Hammer,
    color: "#80D9A1",
    tint: "#EDFAF2",
    bricks: [
      { x: 0, z: 0, level: 0, w: 4, d: 2, color: "green" as const },
      { x: 1, z: 0, level: 1, w: 2, d: 2, color: "purple" as const },
      { x: 0, z: 0, level: 1, w: 1, d: 1, color: "orange" as const },
      { x: 1, z: 0, level: 2, w: 2, d: 1, color: "blue" as const },
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="how-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          color="yellow"
          title="Small steps. Stronger security."
          sub="No jargon, no lectures. Do one small thing, get one satisfying brick."
        />
        <ol className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div
            className="absolute top-[92px] right-[16%] left-[16%] hidden h-0.5 border-t-2 border-dashed border-line md:block"
            aria-hidden
          />
          {STEPS.map((s) => (
            <li key={s.n} className="relative flex flex-col items-center text-center">
              <div
                className="relative grid h-[184px] w-[184px] place-items-center rounded-full"
                style={{ background: `radial-gradient(circle at 50% 40%, #fff 0%, ${s.tint} 70%)` }}
              >
                <IsoBuild bricks={s.bricks} unit={26} className="h-28 w-auto drop-shadow-[0_14px_14px_rgb(36_36_36/0.15)]" />
                <span
                  className="absolute -top-1 -right-1 grid h-11 w-11 place-items-center rounded-2xl font-display text-lg font-semibold text-ink shadow-soft"
                  style={{ background: s.color, boxShadow: "inset 0 -3px 0 rgb(0 0 0 / .12)" }}
                >
                  {s.n}
                </span>
              </div>
              <h3 className="mt-6 flex items-center gap-2 text-2xl font-semibold text-ink">
                <s.icon className="h-5 w-5 text-ink-soft" aria-hidden /> {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ExploreSection() {
  return (
    <section id="explore" className="scroll-mt-20 overflow-hidden bg-mist py-20 sm:py-28" aria-labelledby="explore-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="explore-title"
          eyebrow="Explore the dashboard"
          color="green"
          title="Your progress, built brick by brick"
          sub="A calm, bright home for everything you've learned — with your own structure front and center. This is the real dashboard, shown with sample progress."
        />
        <DashboardPreview />
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/app" variant="secondary" size="lg">
            Open the live demo <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

const WHY = [
  {
    icon: Sparkles,
    title: "Approachable by design",
    text: "Plain language, friendly visuals and five-minute activities make security feel doable instead of intimidating.",
    color: "#FFB36B",
    tint: "#FFF4EA",
  },
  {
    icon: HeartHandshake,
    title: "Learning by doing",
    text: "You practice on realistic, fictional examples — spotting a fake login page beats reading about one.",
    color: "#B9A0F5",
    tint: "#F5F1FE",
  },
  {
    icon: ShieldCheck,
    title: "Progress you can see",
    text: "Every habit becomes a brick, and every brick becomes part of something you made. Motivation, without the pressure.",
    color: "#80D9A1",
    tint: "#EDFAF2",
  },
  {
    icon: Laptop,
    title: "Private from the start",
    text: "Password checks run entirely in your browser, and the demo keeps your progress on your own device.",
    color: "#69B9FF",
    tint: "#EEF7FF",
  },
];

export function WhyBlocksy() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="why-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            id="why-title"
            eyebrow="Why Blocksy?"
            color="purple"
            align="left"
            title="Security advice is everywhere. Doing it is the hard part."
            sub="Blocksy turns good intentions into small, repeatable actions — and celebrates each one. Because the best security habit is the one you actually keep."
          />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {WHY.map((w) => (
            <li key={w.title} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: w.tint }}>
                <w.icon className="h-5 w-5 text-ink" aria-hidden />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{w.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const GALLERY = [
  { name: "The Keep", by: "Built from 17 bricks", bricks: toIso(SAMPLE_CASTLE), tint: "#EEF7FF" },
  { name: "Watchtower", by: "Built from 9 bricks", bricks: toIso(SAMPLE_TOWER), tint: "#FFF8E3" },
  { name: "Safe Passage", by: "Built from 9 bricks", bricks: toIso(SAMPLE_BRIDGE), tint: "#F5F1FE" },
];

export function YourCreation() {
  return (
    <section className="bg-mist py-20 sm:py-28" aria-labelledby="creation-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="creation-title"
          eyebrow="Your Security, Your Creation"
          color="orange"
          title="No two builds look the same"
          sub="Your bricks reflect what you've learned — more blue if you've mastered passwords, more yellow if you're a phishing pro. Stack them however you like."
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {GALLERY.map((g) => (
            <li key={g.name} className="group overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
              <div className="stud-dots grid h-64 place-items-center p-6" style={{ background: g.tint }}>
                <IsoBuild
                  bricks={g.bricks}
                  unit={20}
                  className="max-h-full w-auto max-w-full drop-shadow-[0_18px_18px_rgb(36_36_36/0.15)] transition-transform duration-500 group-hover:-translate-y-1.5"
                  title={`Example build: ${g.name}`}
                />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-display text-lg font-semibold text-ink">{g.name}</span>
                <span className="text-sm font-bold text-ink-soft">{g.by}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-ink-soft">Example builds made in the Blocksy builder.</p>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="cta-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-line bg-white px-6 py-16 text-center shadow-lift sm:px-12 sm:py-20">
          <div className="stud-dots absolute inset-0 opacity-60" aria-hidden />
          <IsoBuild
            bricks={[
              { x: 0, z: 0, level: 0, w: 2, d: 2, color: "blue" },
              { x: 0, z: 0, level: 1, w: 2, d: 1, color: "yellow" },
            ]}
            unit={26}
            className="absolute top-8 left-[6%] hidden h-24 w-auto -rotate-6 drop-shadow-[0_14px_14px_rgb(36_36_36/0.14)] md:block"
          />
          <IsoBuild
            bricks={[
              { x: 0, z: 0, level: 0, w: 4, d: 2, color: "red" },
              { x: 1, z: 0, level: 1, w: 2, d: 2, color: "green" },
            ]}
            unit={24}
            className="absolute right-[5%] bottom-8 hidden h-28 w-auto rotate-3 drop-shadow-[0_14px_14px_rgb(36_36_36/0.14)] md:block"
          />
          <IsoBuild
            bricks={[{ x: 0, z: 0, level: 0, w: 1, d: 1, color: "purple" }]}
            unit={26}
            className="absolute top-14 right-[16%] hidden h-12 w-auto rotate-12 lg:block"
          />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-4xl leading-[1.05] font-semibold text-ink sm:text-6xl">
              Ready to start building?
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-display text-2xl font-medium text-ink">
              Your digital safety starts with one block.
            </p>
            <p className="mx-auto mt-3 max-w-lg text-lg text-ink-soft">
              Learn the basics, build safer habits, and create something awesome along the way.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="/signup" size="lg">
                Start Building for Free <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const SITE = {
  /** Set NEXT_PUBLIC_GITHUB_URL to show a real repository link. */
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
};

export function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { href: "/#features", label: "Features" },
        { href: "/#how-it-works", label: "How It Works" },
        { href: "/app", label: "Live demo" },
      ],
    },
    {
      title: "Trust",
      links: [
        { href: "/privacy", label: "Privacy" },
        { href: "/security", label: "Security" },
      ],
    },
    {
      title: "Project",
      links: [
        ...(SITE.github ? [{ href: SITE.github, label: "GitHub" }] : []),
        { href: "/contact", label: "Contact" },
      ],
    },
  ];
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="blocksy. home">
            <BrickMark className="h-8 w-8" />
            <span className="font-display text-[1.65rem] leading-none font-bold tracking-[-0.02em] text-ink">
              blocksy<span className="text-coral">.</span>
            </span>
          </Link>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Make online safety click. A playful way to learn cybersecurity and build better digital
            habits, one brick at a time.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-sans text-sm font-extrabold tracking-wide text-ink uppercase">{c.title}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[15px] font-semibold text-ink-soft transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              {c.title === "Project" && !SITE.github && (
                <li className="text-[15px] font-semibold text-ink-soft/70">
                  GitHub <span className="text-xs">(link coming soon)</span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Blocksy. An educational portfolio project.</p>
          <p>Brick designs are original and not affiliated with any toy company.</p>
        </div>
      </div>
    </footer>
  );
}
