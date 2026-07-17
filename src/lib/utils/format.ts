/**
 * Format a number with thousands separators, e.g. 4250 -> "4 250".
 * A narrow no-break space is used to match the AtlasIQ numeric style.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

/** Format a fractional accuracy value (0-1) as a whole percentage, e.g. 0.92 -> "92%". */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** Format seconds as mm:ss, used for question timers. */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/** Format an ISO date as a short Russian date+time, e.g. "8 июл, 14:10". */
export function formatShortDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Format a duration in seconds as a compact Russian "learning time" label, e.g. "2ч 15мин" or "42мин". */
export function formatLearningTime(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} мин`;
  return `${hours}ч ${minutes} мин`;
}

/** Format a streak/day count with correct Russian pluralization. */
export function formatDays(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return `${count} дней`;
  if (mod10 === 1) return `${count} день`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} дня`;
  return `${count} дней`;
}
