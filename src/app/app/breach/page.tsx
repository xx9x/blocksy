"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Database, Info, Loader2, Search } from "lucide-react";
import { BREACH_STEPS, DEMO_IDENTITIES } from "@/lib/content";
import { actions, useDemo } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Checklist } from "@/components/activities/Checklist";
import { Button, Card } from "@/components/ui";

function DemoChecker() {
  const [selected, setSelected] = useState(DEMO_IDENTITIES[0].id);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [shown, setShown] = useState<string | null>(null);
  const identity = DEMO_IDENTITIES.find((d) => d.id === shown);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-dashed border-coral/60 bg-[#FFF0F0] px-5 py-2.5">
        <span className="text-xs font-extrabold tracking-wide text-coral-ink uppercase">Demonstration only</span>
        <span className="text-xs font-bold text-coral-ink">No real lookups are made</span>
      </div>
      <div className="p-5 sm:p-7">
        <h2 className="text-2xl font-semibold text-ink">Demo breach check</h2>
        <p className="mt-1 text-[15px] text-ink-soft">
          Pick one of three fictional people to see what a breach report looks like. To protect your privacy, this demo
          doesn&apos;t accept real email addresses.
        </p>
        <fieldset className="mt-4 flex flex-col gap-2">
          <legend className="sr-only">Fictional identity</legend>
          {DEMO_IDENTITIES.map((d) => (
            <label
              key={d.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors ${
                selected === d.id ? "border-coral bg-[#FFF0F0]/60" : "border-line hover:bg-mist"
              }`}
            >
              <input
                type="radio"
                name="identity"
                value={d.id}
                checked={selected === d.id}
                onChange={() => setSelected(d.id)}
                className="h-4 w-4 accent-[#FF777B]"
              />
              <span className="min-w-0">
                <span className="block font-mono text-sm font-bold text-ink">{d.email}</span>
                <span className="block text-xs font-semibold text-ink-soft">{d.label}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <Button
          className="mt-4 w-full"
          disabled={state === "loading"}
          onClick={() => {
            setState("loading");
            setTimeout(() => {
              setShown(selected);
              setState("done");
            }, 900);
          }}
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Run demo check
        </Button>

        <div aria-live="polite">
          {state === "done" && identity && (
            <div className="mt-5">
              <p className="text-xs font-bold text-ink-soft">
                Simulated result for <span className="font-mono">{identity.email}</span> · fictional data
              </p>
              {identity.breaches.length === 0 ? (
                <p className="mt-2 flex items-center gap-2 rounded-2xl bg-[#EDFAF2] p-4 font-bold text-mint-ink">
                  <CheckCircle2 className="h-5 w-5" /> No breaches in this demo dataset. In real life, “none found” only
                  means none are known yet.
                </p>
              ) : (
                <ul className="mt-2 flex flex-col gap-2.5">
                  {identity.breaches.map((b) => (
                    <li key={b.service} className="rounded-2xl border border-line p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex items-center gap-2 font-bold text-ink">
                          <AlertTriangle className="h-4 w-4 text-coral-ink" /> {b.service}
                        </p>
                        <span className="shrink-0 text-xs font-bold text-ink-soft">{b.date}</span>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {b.exposed.map((e) => (
                          <li key={e} className="rounded-full bg-[#FFF0F0] px-2.5 py-0.5 text-xs font-bold text-coral-ink">
                            {e}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm text-ink-soft">{b.note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <p className="mt-5 flex items-start gap-2 rounded-2xl bg-mist p-3.5 text-sm text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong className="text-ink">Real breach checks — coming soon.</strong> A future version could use an
            authorized provider such as Have I Been Pwned, following its API terms. Until then, Blocksy never claims to
            have checked your address.
          </span>
        </p>
      </div>
    </Card>
  );
}

export default function BreachPage() {
  const checked = useDemo((s) => s.breach);
  return (
    <>
      <PageHeader
        title="Breach Awareness"
        badge="Red bricks · Security alerts"
        color="red"
        description="Companies get hacked, and sometimes your details go with them. Learn what a breach means, explore a clearly labeled demo, and build your response plan."
        bricks={[
          { x: 0, z: 0, level: 0, w: 4, d: 2, color: "red" },
          { x: 2, z: 0, level: 1, w: 2, d: 1, color: "yellow" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card className="p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
              <Database className="h-5 w-5 text-coral-ink" /> What is a data breach?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              A breach happens when information a company stores — emails, passwords, addresses, payment details — is
              accessed by someone who shouldn&apos;t have it. It&apos;s usually not your fault, but what you do next
              matters.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="rounded-2xl bg-[#FFF0F0] p-4">
                <p className="font-bold text-ink">Biggest risk</p>
                <p className="text-sm text-ink-soft">Reused passwords: attackers try leaked logins on other sites.</p>
              </li>
              <li className="rounded-2xl bg-[#FFF8E3] p-4">
                <p className="font-bold text-ink">Next most common</p>
                <p className="text-sm text-ink-soft">Targeted phishing that mentions the breach to seem legitimate.</p>
              </li>
            </ul>
          </Card>
          <DemoChecker />
        </div>
        <Checklist
          title="If an account is exposed"
          items={BREACH_STEPS}
          checked={checked}
          onToggle={actions.toggleBreachStep}
          color="red"
          note="Tick each step once you understand it. Completing the plan finishes the lesson."
          completeText="Breach lesson complete — red 2×4 brick earned!"
        />
      </div>
    </>
  );
}
