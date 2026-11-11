"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { PrivacyChecklist } from "@/components/activities/Checklist";
import { Card } from "@/components/ui";

const WHY = [
  ["Less to leak", "Data you don't share can't be exposed in a breach or scraped by strangers."],
  ["Harder to target", "Scammers use public details — your workplace, pets, holidays — to make messages convincing."],
  ["Easier recovery", "Up-to-date recovery options mean you get back in, not the person who took over."],
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Check"
        badge="Purple bricks · Privacy protection"
        color="purple"
        description="A friendly, self-paced checkup for the settings that matter most. Each item takes a few minutes on your own devices — tick it off here when you're done."
        bricks={[
          { x: 0, z: 0, level: 0, w: 2, d: 4, color: "purple" },
          { x: 0, z: 1, level: 1, w: 2, d: 2, color: "purple" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <PrivacyChecklist />
        <Card className="h-fit p-5 sm:p-7">
          <h2 className="text-2xl font-semibold text-ink">Why it matters</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {WHY.map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 h-4 w-6 shrink-0 rounded-[5px] bg-lav shadow-[inset_0_-2px_0_rgb(0_0_0/0.1)]" aria-hidden />
                <span>
                  <span className="block font-bold text-ink">{t}</span>
                  <span className="block text-[15px] text-ink-soft">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-mist p-4 text-sm text-ink-soft">
            <strong className="text-ink">Tip:</strong> set a reminder to repeat this checkup every few months — new apps
            and settings appear all the time.
          </p>
        </Card>
      </div>
    </>
  );
}
