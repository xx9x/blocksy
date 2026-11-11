"use client";

import { Fingerprint, KeyRound, Smartphone } from "lucide-react";
import { MFA_METHODS } from "@/lib/content";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MFAChecklist } from "@/components/activities/Checklist";
import { Card } from "@/components/ui";

const FACTORS = [
  { icon: KeyRound, title: "Something you know", text: "A password or PIN.", color: "#69B9FF", tint: "#EEF7FF" },
  { icon: Smartphone, title: "Something you have", text: "Your phone, an app or a security key.", color: "#80D9A1", tint: "#EDFAF2" },
  { icon: Fingerprint, title: "Something you are", text: "A fingerprint or face scan on your device.", color: "#B9A0F5", tint: "#F5F1FE" },
];

export default function MfaPage() {
  return (
    <>
      <PageHeader
        title="MFA Builder"
        badge="Green bricks · Multi-factor authentication"
        color="green"
        description="Multi-factor authentication means a stolen password alone isn't enough to get into your account. Learn the options, then work through the checklist."
        bricks={[
          { x: 0, z: 0, level: 0, w: 2, d: 2, color: "green" },
          { x: 2, z: 0, level: 0, w: 2, d: 2, color: "teal" },
          { x: 1, z: 0, level: 1, w: 2, d: 2, color: "green" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-5 sm:p-7">
            <h2 className="text-2xl font-semibold text-ink">Two keys are better than one</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              MFA asks for two different kinds of proof. Even if someone phishes or guesses your password, they still
              need the second factor — which is usually in your pocket.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {FACTORS.map((f) => (
                <li key={f.title} className="rounded-2xl p-4" style={{ background: f.tint }}>
                  <f.icon className="h-6 w-6" style={{ color: f.color }} />
                  <p className="mt-2 font-bold text-ink">{f.title}</p>
                  <p className="text-sm text-ink-soft">{f.text}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 sm:p-7">
            <h2 className="text-2xl font-semibold text-ink">Compare the methods</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {MFA_METHODS.map((m) => (
                <li key={m.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-ink">{m.name}</p>
                    <span className="flex items-center gap-1" aria-label={`Protection level ${m.strength} of 3`}>
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="h-3 w-5 rounded-[4px]"
                          style={{
                            background: i <= m.strength ? "#80D9A1" : "#EEF0F4",
                            boxShadow: i <= m.strength ? "inset 0 -2px 0 rgb(0 0 0 / .1)" : undefined,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1 text-[14.5px] text-ink-soft">{m.summary}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    <span className="text-orange-ink">Watch out:</span> {m.watchOut}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div>
          <MFAChecklist />
        </div>
      </div>
    </>
  );
}
