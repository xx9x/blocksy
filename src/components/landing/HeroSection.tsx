"use client";

import { motion } from "motion/react";
import { ArrowRight, Fingerprint, Laptop, Sparkles, Timer } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { BrickScene } from "@/components/three/BrickScene";
import { IsoBrick } from "@/components/bricks/IsoBuild";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 pt-6 pb-16 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:gap-4 lg:pt-10 lg:pb-24">
        <div className="relative z-10 max-w-xl">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-3.5 pl-1.5 text-sm font-bold text-ink shadow-soft">
              <span className="flex gap-0.5" aria-hidden>
                <span className="h-5 w-2.5 rounded-l-full bg-sky" />
                <span className="h-5 w-2.5 bg-sun" />
                <span className="h-5 w-2.5 rounded-r-full bg-coral" />
              </span>
              Cybersecurity, made fun.
            </span>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.025em] text-ink sm:text-6xl lg:text-[4.35rem]"
          >
            Build a <span className="text-[#2F8FEA]">safer</span> digital world,{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                className="absolute inset-x-[-0.12em] bottom-[0.06em] -z-10 h-[0.42em] rounded-[0.18em] bg-sun shadow-[inset_0_-4px_0_rgb(0_0_0/0.08)]"
                aria-hidden
              />
              one block
            </span>{" "}
            at a time.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-soft sm:text-[1.2rem]"
          >
            Blocksy makes cybersecurity simple and fun. Learn to spot threats, strengthen your
            accounts, and build better digital safety habits while collecting colorful bricks along
            the way.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="/signup" size="lg" className="group">
              Start Building
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/#explore" variant="secondary" size="lg">
              Explore Blocksy
            </ButtonLink>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-ink-soft"
          >
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#EEF7FF] text-sky-ink">
                <Laptop className="h-3.5 w-3.5" />
              </span>
              Checks run in your browser
            </li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF4EA] text-orange-ink">
                <Timer className="h-3.5 w-3.5" />
              </span>
              Five-minute lessons
            </li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#EDFAF2] text-mint-ink">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              Free demo, no account needed
            </li>
          </motion.ul>
        </div>

        <div className="relative -mx-5 sm:mx-0">
          <BrickScene className="mx-auto aspect-[1/0.95] w-full max-w-[640px] lg:aspect-[1/1.02]" />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="pointer-events-none absolute bottom-[6%] left-4 hidden items-center gap-3 rounded-2xl border border-line bg-white/95 py-2.5 pr-4 pl-2.5 shadow-lift backdrop-blur sm:flex lg:left-0"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EDFAF2]">
              <IsoBrick size="1x2" color="green" unit={13} className="h-7 w-8" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold text-mint-ink">+1 green brick</span>
              <span className="block text-sm font-bold text-ink">MFA lesson complete</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="pointer-events-none absolute right-4 bottom-[6%] hidden items-center gap-2.5 rounded-2xl border border-line bg-white/95 px-3 py-2.5 shadow-lift backdrop-blur sm:flex lg:-right-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EEF7FF] text-sky-ink">
              <Fingerprint className="h-4.5 w-4.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold text-ink-soft">Password strength</span>
              <span className="mt-1 flex items-center gap-1" aria-label="4 of 4">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1.5 w-6 rounded-full bg-mint" />
                ))}
                <span className="ml-1 text-xs font-extrabold text-mint-ink">Strong</span>
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
