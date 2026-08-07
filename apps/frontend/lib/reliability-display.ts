/**
 * Display logic for the reliability panel (DOS-503).
 *
 * Kept separate from the component so the rules that decide what a guest is
 * shown can be tested directly. The important one: a number we cannot stand
 * behind is never rendered as a number.
 */

export interface ReliabilityUptime {
  upMinutes: number | null;
  downMinutes: number | null;
  degradedMinutes: number | null;
  unknownMinutes: number | null;
  uptimePct: number | null;
  coveragePct: number | null;
  publishable: boolean;
}

export interface ReliabilityWifi {
  samples: number;
  medianDownloadMbps: number | null;
  worstDecileDownloadMbps: number | null;
  avgPacketLossPct: number | null;
}

export interface ReliabilityHourly {
  hour: number;
  observations: number;
  availabilityPct: number | null;
}

export interface UptimeDisplay {
  value: string;
  /** Shown beneath the value. Null when the figure needs no qualification. */
  caveat: string | null;
  tone: "good" | "fair" | "poor" | "unknown";
}

/**
 * Turn an uptime measurement into what the guest actually sees.
 *
 * When coverage is too low the percentage is withheld entirely rather than
 * shown with a footnote — a number on a page gets believed and remembered, and
 * a caveat underneath it does not undo that.
 */
export function formatUptime(uptime: ReliabilityUptime | null | undefined): UptimeDisplay {
  if (!uptime || uptime.uptimePct === null || uptime.coveragePct === null) {
    return { value: "Not measured", caveat: "We have no readings for this period.", tone: "unknown" };
  }

  if (!uptime.publishable) {
    return {
      value: "Not enough data",
      caveat: `Our sensors only covered ${Math.round(uptime.coveragePct)}% of this period, which isn't enough to quote a figure.`,
      tone: "unknown",
    };
  }

  const pct = uptime.uptimePct;
  return {
    value: `${pct}%`,
    caveat:
      uptime.coveragePct >= 99
        ? null
        : `Measured across ${Math.round(uptime.coveragePct)}% of the period.`,
    tone: pct >= 98 ? "good" : pct >= 90 ? "fair" : "poor",
  };
}

/**
 * The connectivity line. Leads with the worst decile, not the median: someone
 * deciding whether they can take a call from here needs the floor.
 */
export function formatWifi(wifi: ReliabilityWifi | null | undefined): UptimeDisplay {
  if (!wifi || !wifi.samples || wifi.medianDownloadMbps === null) {
    return { value: "Not measured", caveat: "We have no speed tests for this period.", tone: "unknown" };
  }

  const floor = wifi.worstDecileDownloadMbps;
  const median = wifi.medianDownloadMbps;

  return {
    value: `${median} Mbps`,
    caveat:
      floor === null
        ? `Median of ${wifi.samples} tests.`
        : `Typical speed. On the slowest 10% of tests it dropped to ${floor} Mbps.`,
    tone: floor === null ? "unknown" : floor >= 10 ? "good" : floor >= 2 ? "fair" : "poor",
  };
}

/**
 * Hours where hot water was unreliable, so the panel can name them rather than
 * making a guest read a 24-bar chart. Unobserved hours are excluded — we do not
 * know about them, which is different from them being bad.
 */
export function unreliableHours(
  hours: ReliabilityHourly[] | null | undefined,
  threshold = 80
): ReliabilityHourly[] {
  if (!hours) return [];
  return hours.filter(h => h.observations > 0 && h.availabilityPct !== null && h.availabilityPct < threshold);
}

/** "6am", "12pm", "11pm" — a guest reads times, not 24-hour integers. */
export function formatHour(hour: number): string {
  const suffix = hour < 12 ? "am" : "pm";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}${suffix}`;
}

/**
 * Summarise the bad hours in a sentence. Returns null when there is nothing to
 * warn about — an empty warning box is worse than no box.
 */
export function hotWaterWarning(hours: ReliabilityHourly[] | null | undefined): string | null {
  const bad = unreliableHours(hours);
  if (!bad.length) return null;

  const times = bad.map(h => formatHour(h.hour));
  if (times.length === 1) return `Hot water is unreliable around ${times[0]}.`;
  if (times.length === 2) return `Hot water is unreliable around ${times[0]} and ${times[1]}.`;
  return `Hot water is unreliable at ${times.length} hours of the day, including ${times[0]} and ${times[1]}.`;
}

/** How stale the record is, so a guest can judge whether it still describes the place. */
export function formatComputedAt(computedAt: string | null | undefined, now = new Date()): string {
  if (!computedAt) return "never";
  const then = new Date(computedAt);
  if (Number.isNaN(then.getTime())) return "never";

  const minutes = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
