/** Local-date helpers (YYYY-MM-DD in the user's own timezone). */

export function dayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/** Last `n` days ending today, oldest first. */
export function lastDays(n: number, end = new Date()): Date[] {
  return Array.from({ length: n }, (_, i) => addDays(end, i - (n - 1)));
}

/**
 * Consecutive days with at least one logged habit, counting back from
 * today (or from yesterday if nothing has been logged yet today).
 */
export function currentStreak(habits: Record<string, string[]>, today?: Date): number {
  let cursor = today ? new Date(today) : new Date();
  if (!habits[dayKey(cursor)]?.length) cursor = addDays(cursor, -1);
  let streak = 0;
  while (habits[dayKey(cursor)]?.length) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
