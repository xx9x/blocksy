"use client";

import { motion } from "motion/react";
import { Check, Clock } from "lucide-react";
import { BRICK_COLORS, type BrickColor } from "@/lib/bricks";
import { MFA_STEPS, PRIVACY_ITEMS, type ChecklistItem } from "@/lib/content";
import { actions, useDemo } from "@/lib/store";
import { Card, ProgressBar } from "@/components/ui";

export function Checklist({
  title,
  items,
  checked,
  onToggle,
  color,
  note,
  completeText,
}: {
  title: string;
  items: (ChecklistItem & { minutes?: number })[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  color: BrickColor;
  note: string;
  completeText: string;
}) {
  const c = BRICK_COLORS[color];
  const done = items.filter((i) => checked[i.id]).length;
  const complete = done === items.length;
  return (
    <Card className="p-5 sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <span className="font-display text-xl font-semibold tabular-nums" style={{ color: c.ink }}>
          {done}/{items.length}
        </span>
      </div>
      <ProgressBar value={(done / items.length) * 100} color={color} className="mt-3" label={`${title} progress`} />
      <p className="mt-3 text-xs font-semibold text-ink-soft">{note}</p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {items.map((item) => {
          const on = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => onToggle(item.id)}
                className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 ${
                  on ? "border-transparent" : "border-line bg-white hover:border-[#d9d9d9]"
                }`}
                style={on ? { background: c.tint, boxShadow: `inset 0 0 0 1.5px ${c.hex}` } : undefined}
              >
                <span
                  className="relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] transition-colors"
                  style={{
                    background: on ? c.hex : "#F3F4F7",
                    boxShadow: on ? "inset 0 -3px 0 rgb(0 0 0 / .12), inset 0 1px 0 rgb(255 255 255 / .4)" : "inset 0 0 0 1.5px #E1E3E8",
                  }}
                  aria-hidden
                >
                  {on ? (
                    <motion.span initial={{ scale: 0.3, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                      <Check className="h-4.5 w-4.5 text-white" strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <span className="h-3 w-3 rounded-full bg-white shadow-[inset_0_-1px_0_rgb(0_0_0/0.1)]" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink">{item.title}</span>
                    {item.minutes && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft">
                        <Clock className="h-3 w-3" /> ~{item.minutes} min
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[14.5px] leading-relaxed text-ink-soft">{item.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {complete && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl px-4 py-3 text-center font-display text-lg font-semibold"
          style={{ background: c.tint, color: c.ink }}
        >
          {completeText}
        </motion.p>
      )}
    </Card>
  );
}

export function MFAChecklist() {
  const checked = useDemo((s) => s.mfa);
  return (
<ChecklistFor kind="mfa" checked={checked} />
  );
}

export function PrivacyChecklist() {
  const checked = useDemo((s) => s.privacy);
  return <ChecklistFor kind="privacy" checked={checked} />;
}


function ChecklistFor({ kind, checked }: { kind: "mfa" | "privacy"; checked: Record<string, boolean> }) {
  if (kind === "mfa")
    return (
      <Checklist
        title="MFA setup checklist"
        items={MFA_STEPS}
        checked={checked}
        onToggle={actions.toggleMfa}
        color="green"
        note="Self-reported: tick each step once you've done or understood it. Blocksy can't see your real accounts, so it never claims they're protected."
        completeText="MFA Builder complete — green 2×4 brick earned!"
      />
    );
  return (
    <Checklist
      title="Your privacy checkup"
      items={PRIVACY_ITEMS}
      checked={checked}
      onToggle={actions.togglePrivacy}
      color="purple"
      note="Self-reported: do each check on your own devices and accounts, then tick it here. Nothing is scanned or uploaded."
      completeText="Privacy Check complete — purple 2×4 brick earned!"
    />
  );
}
