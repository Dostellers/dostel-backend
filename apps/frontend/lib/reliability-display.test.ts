import { describe, expect, it } from "vitest";
import {
  formatUptime,
  formatWifi,
  unreliableHours,
  formatHour,
  hotWaterWarning,
  formatComputedAt,
  type ReliabilityUptime,
} from "./reliability-display.js";

const uptime = (over: Partial<ReliabilityUptime> = {}): ReliabilityUptime => ({
  upMinutes: 1000,
  downMinutes: 0,
  degradedMinutes: 0,
  unknownMinutes: 0,
  uptimePct: 100,
  coveragePct: 100,
  publishable: true,
  ...over,
});

describe("formatUptime — withholding what we can't stand behind", () => {
  it("shows the figure when coverage is good", () => {
    const d = formatUptime(uptime({ uptimePct: 99.2 }));
    expect(d.value).toBe("99.2%");
    expect(d.tone).toBe("good");
    expect(d.caveat).toBeNull();
  });

  it("withholds the number entirely when coverage is too low", () => {
    // A percentage on a page gets believed and remembered; a footnote under it
    // does not undo that. So it is not shown at all.
    const d = formatUptime(uptime({ uptimePct: 100, coveragePct: 40, publishable: false }));
    expect(d.value).toBe("Not enough data");
    expect(d.value).not.toContain("100");
    expect(d.caveat).toContain("40%");
    expect(d.tone).toBe("unknown");
  });

  it("says so when nothing was measured, rather than implying perfection", () => {
    const d = formatUptime(uptime({ uptimePct: null, coveragePct: 0, publishable: false }));
    expect(d.value).toBe("Not measured");
    expect(d.tone).toBe("unknown");
  });

  it("handles a missing record", () => {
    expect(formatUptime(null).value).toBe("Not measured");
    expect(formatUptime(undefined).tone).toBe("unknown");
  });

  it("notes partial coverage alongside a publishable figure", () => {
    const d = formatUptime(uptime({ uptimePct: 97, coveragePct: 92 }));
    expect(d.value).toBe("97%");
    expect(d.caveat).toContain("92%");
  });

  it("reports a bad month as bad", () => {
    // The mechanism only works if this renders honestly.
    const d = formatUptime(uptime({ uptimePct: 61.4, coveragePct: 99, downMinutes: 5000 }));
    expect(d.value).toBe("61.4%");
    expect(d.tone).toBe("poor");
  });

  it("grades tone at the boundaries", () => {
    expect(formatUptime(uptime({ uptimePct: 98 })).tone).toBe("good");
    expect(formatUptime(uptime({ uptimePct: 97.9 })).tone).toBe("fair");
    expect(formatUptime(uptime({ uptimePct: 90 })).tone).toBe("fair");
    expect(formatUptime(uptime({ uptimePct: 89.9 })).tone).toBe("poor");
  });
});

describe("formatWifi — leading with the floor", () => {
  it("names the slow-tail speed, not just the median", () => {
    const d = formatWifi({
      samples: 200,
      medianDownloadMbps: 40,
      worstDecileDownloadMbps: 1,
      avgPacketLossPct: 2,
    });
    expect(d.value).toBe("40 Mbps");
    expect(d.caveat).toContain("1 Mbps");
    // A fast median with an unusable floor must not read as good.
    expect(d.tone).toBe("poor");
  });

  it("reads as good only when the floor holds up", () => {
    expect(
      formatWifi({ samples: 100, medianDownloadMbps: 45, worstDecileDownloadMbps: 20, avgPacketLossPct: 0 }).tone
    ).toBe("good");
    expect(
      formatWifi({ samples: 100, medianDownloadMbps: 45, worstDecileDownloadMbps: 5, avgPacketLossPct: 0 }).tone
    ).toBe("fair");
  });

  it("says so when there are no tests", () => {
    const d = formatWifi({ samples: 0, medianDownloadMbps: null, worstDecileDownloadMbps: null, avgPacketLossPct: null });
    expect(d.value).toBe("Not measured");
    expect(formatWifi(null).value).toBe("Not measured");
  });
});

describe("hot water by hour", () => {
  const hours = (over: Record<number, number | null>) =>
    Array.from({ length: 24 }, (_, hour) => ({
      hour,
      observations: over[hour] === undefined ? 0 : 10,
      availabilityPct: over[hour] === undefined ? null : over[hour],
    }));

  it("flags only the hours that were actually bad", () => {
    const bad = unreliableHours(hours({ 5: 100, 6: 20, 7: 100 }));
    expect(bad.map(h => h.hour)).toEqual([6]);
  });

  it("does not flag hours we never observed", () => {
    // Unobserved is not the same as bad — claiming otherwise is the mirror of
    // counting gaps as uptime.
    const bad = unreliableHours(hours({ 5: 100 }));
    expect(bad).toHaveLength(0);
  });

  it("formats hours the way a guest reads them", () => {
    expect(formatHour(0)).toBe("12am");
    expect(formatHour(6)).toBe("6am");
    expect(formatHour(12)).toBe("12pm");
    expect(formatHour(18)).toBe("6pm");
    expect(formatHour(23)).toBe("11pm");
  });

  it("writes a warning only when there is something to warn about", () => {
    expect(hotWaterWarning(hours({ 5: 100, 6: 100 }))).toBeNull();
    expect(hotWaterWarning([])).toBeNull();
    expect(hotWaterWarning(null)).toBeNull();

    expect(hotWaterWarning(hours({ 6: 20 }))).toBe("Hot water is unreliable around 6am.");
    expect(hotWaterWarning(hours({ 6: 20, 7: 30 }))).toBe("Hot water is unreliable around 6am and 7am.");
    expect(hotWaterWarning(hours({ 5: 10, 6: 20, 7: 30 }))).toContain("3 hours of the day");
  });
});

describe("formatComputedAt", () => {
  const now = new Date("2026-08-07T12:00:00Z");

  it("describes freshness in units a reader can judge", () => {
    expect(formatComputedAt("2026-08-07T11:59:40Z", now)).toBe("just now");
    expect(formatComputedAt("2026-08-07T11:30:00Z", now)).toBe("30 min ago");
    expect(formatComputedAt("2026-08-07T06:00:00Z", now)).toBe("6h ago");
    expect(formatComputedAt("2026-08-04T12:00:00Z", now)).toBe("3d ago");
  });

  it("handles a missing or unparseable timestamp", () => {
    expect(formatComputedAt(null, now)).toBe("never");
    expect(formatComputedAt("not-a-date", now)).toBe("never");
  });
});
