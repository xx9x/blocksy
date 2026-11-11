import { BRICK_COLORS } from "@/lib/bricks";
import { learningProgress, type DemoState } from "@/lib/store";
import { ProgressBar } from "@/components/ui";

export function ProgressTracker({ state }: { state: DemoState }) {
  const { modules } = learningProgress(state);
  return (
    <ul className="flex flex-col gap-4">
      {modules.map((m) => {
        const pct = (m.done / m.total) * 100;
        return (
          <li key={m.id}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-bold text-ink">
                <span className="h-3 w-3 rounded-[4px]" style={{ background: BRICK_COLORS[m.color].hex }} aria-hidden />
                {m.label}
              </span>
              <span className="font-bold text-ink-soft tabular-nums">
                {m.done}/{m.total}
              </span>
            </div>
            <ProgressBar value={pct} color={m.color} label={`${m.label} progress`} />
          </li>
        );
      })}
    </ul>
  );
}
