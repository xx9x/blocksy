"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, RotateCcw, Trash2 } from "lucide-react";
import { actions, useDemo, type MotionPref } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button, Card } from "@/components/ui";

const MOTION: { value: MotionPref; label: string; hint: string }[] = [
  { value: "system", label: "Match my device", hint: "Follows your operating system's reduced-motion setting." },
  { value: "reduced", label: "Reduce motion", hint: "Static 3D scenes and minimal animation." },
  { value: "full", label: "Full motion", hint: "Floating bricks and celebrations everywhere." },
];

export default function SettingsPage() {
  const s = useDemo();
  const router = useRouter();
  const [name, setName] = useState(s.profile?.name ?? "");
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader
        title="Settings"
        color="teal"
        badge="Demo mode"
        description="Everything here applies to this browser only. Blocksy's demo has no server, no real account and never stores passwords."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-ink">Profile</h2>
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              actions.rename(name);
              setSaved(true);
              setTimeout(() => setSaved(false), 1800);
            }}
          >
            <label htmlFor="display-name" className="text-sm font-bold text-ink">
              Display name
            </label>
            <div className="flex gap-2">
              <input
                id="display-name"
                value={name}
                maxLength={24}
                onChange={(e) => setName(e.target.value)}
                className="h-11 min-w-0 flex-1 rounded-2xl border border-line px-4 outline-none focus:border-sky focus:ring-4 focus:ring-sky/20"
              />
              <Button type="submit">{saved ? "Saved!" : "Save"}</Button>
            </div>
            {s.profile?.email && (
              <p className="text-sm text-ink-soft">
                Demo email: <span className="font-semibold text-ink">{s.profile.email}</span> (stored locally, never sent
                anywhere)
              </p>
            )}
          </form>
        </Card>

        <Card className="p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-ink">Motion</h2>
          <fieldset className="mt-4 flex flex-col gap-2">
            <legend className="sr-only">Animation preference</legend>
            {MOTION.map((m) => (
              <label
                key={m.value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 ${
                  s.settings.motion === m.value ? "border-teal bg-[#ECF9F8]" : "border-line hover:bg-mist"
                }`}
              >
                <input
                  type="radio"
                  name="motion"
                  className="mt-1 h-4 w-4 accent-[#78D8D0]"
                  checked={s.settings.motion === m.value}
                  onChange={() => actions.setMotion(m.value)}
                />
                <span>
                  <span className="block font-bold text-ink">{m.label}</span>
                  <span className="block text-sm text-ink-soft">{m.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </Card>

        <Card className="p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-ink">Your data</h2>
          <p className="mt-2 text-[15px] text-ink-soft">
            Progress is saved in this browser&apos;s local storage: your display name, earned bricks, build layout,
            checklist ticks and habit log. Clearing your browser data removes it.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => {
              const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "blocksy-demo-progress.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4" /> Export my progress (JSON)
          </Button>
        </Card>

        <Card className="border-[#FFD0D2] p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-ink">Reset</h2>
          <p className="mt-2 text-[15px] text-ink-soft">Start over whenever you like. Bricks you&apos;ve earned stay yours when you clear the build.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => actions.resetBuild()}>
              <RotateCcw className="h-4 w-4" /> Clear my build
            </Button>
            {!confirmReset ? (
              <Button variant="secondary" className="text-coral-ink" onClick={() => setConfirmReset(true)}>
                <Trash2 className="h-4 w-4" /> Delete all demo data
              </Button>
            ) : (
              <span className="flex flex-wrap items-center gap-2 rounded-2xl bg-[#FFF0F0] p-2 pl-3 text-sm font-bold text-coral-ink">
                This removes all bricks, progress and achievements.
                <Button
                  size="sm"
                  className="bg-coral-ink hover:bg-coral-ink"
                  onClick={() => {
                    actions.resetAll();
                    router.push("/");
                  }}
                >
                  Delete everything
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </span>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
