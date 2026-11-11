"use client";

import { CheckCircle2, KeyRound, Layers, Repeat, Wand2 } from "lucide-react";
import { actions, useDemo } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PasswordChecker } from "@/components/activities/PasswordChecker";
import { Button, Card, DemoNote } from "@/components/ui";

const TIPS = [
  {
    icon: Layers,
    title: "Length beats complexity",
    text: "Every extra character multiplies the guesses needed. Aim for 16+ characters — four random words get you there easily.",
  },
  {
    icon: Repeat,
    title: "One account, one password",
    text: "When a site is breached, attackers try the same email and password everywhere else. Unique passwords stop that domino effect.",
  },
  {
    icon: Wand2,
    title: "Avoid predictable patterns",
    text: "Names, birthdays, keyboard runs and “Password1!” substitutions are the first things cracking tools try.",
  },
  {
    icon: KeyRound,
    title: "Let a password manager remember",
    text: "A manager generates and fills strong, unique passwords — and won't autofill on a fake site. Passkeys are even better where offered.",
  },
];

export default function PasswordPage() {
  const tried = useDemo((s) => !!s.rewards["password:first"]);
  const done = useDemo((s) => !!s.rewards["password:lesson"]);

  return (
    <>
      <PageHeader
        title="Password Check"
        badge="Blue bricks · Password security"
        color="blue"
        description="See how attackers think about passwords, and what actually makes one strong. Every check happens in your browser — nothing you type leaves this page."
        bricks={[
          { x: 0, z: 0, level: 0, w: 4, d: 2, color: "blue" },
          { x: 1, z: 0, level: 1, w: 2, d: 2, color: "blue" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-4">
          <PasswordChecker />
          <DemoNote>
            This is an educational estimate based on length, variety and common patterns. It doesn&apos;t
            check whether a password has appeared in real breaches, and it never stores what you type.
          </DemoNote>
        </div>
        <Card className="p-5 sm:p-7">
          <h2 className="text-2xl font-semibold text-ink">The password lesson</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {TIPS.map((t) => (
              <li key={t.title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF7FF] text-sky-ink">
                  <t.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold text-ink">{t.title}</span>
                  <span className="block text-[15px] leading-relaxed text-ink-soft">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-mist p-4">
            {done ? (
              <p className="flex items-center gap-2 font-bold text-mint-ink">
                <CheckCircle2 className="h-5 w-5" /> Lesson complete — blue 2×4 brick earned.
              </p>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink-soft">
                  {tried
                    ? "Nice — you've tried the checker. Finish the lesson to earn a blue 2×4 brick."
                    : "Try the checker first, then mark the lesson complete to earn a blue 2×4 brick."}
                </p>
                <Button className="mt-3 w-full" disabled={!tried} onClick={() => actions.passwordLesson()}>
                  I&apos;ve read the lesson
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
