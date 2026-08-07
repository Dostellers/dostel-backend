import {
  formatUptime,
  formatWifi,
  hotWaterWarning,
  formatComputedAt,
  type ReliabilityUptime,
  type ReliabilityWifi,
  type ReliabilityHourly,
  type UptimeDisplay,
} from "@/lib/reliability-display";

/**
 * The measured reliability record (DOS-503).
 *
 * Everything here is a reading, not a claim. Bad periods render as bad — that is
 * the point of the panel, and the reason a guest has any reason to believe the
 * good ones.
 */

interface ReliabilityWindow {
  power: ReliabilityUptime;
  hotWater: ReliabilityUptime;
  wifi: ReliabilityWifi;
}

interface HostelReliability {
  computedAt: string;
  minPublishableCoveragePct: number;
  last7d: ReliabilityWindow;
  last30d: ReliabilityWindow;
  last90d: ReliabilityWindow;
  hotWaterByHour: ReliabilityHourly[];
  totalObservations: number;
}

interface ReliabilityPanelProps {
  reliability: HostelReliability | null;
  /** Which window to lead with. 30d is the honest default: long enough to
   *  include a bad week, short enough to still describe the place today. */
  window?: "last7d" | "last30d" | "last90d";
}

const TONE_CLASS: Record<UptimeDisplay["tone"], string> = {
  good: "text-[var(--color-success,#16a34a)]",
  fair: "text-[var(--color-sunset,#e07a2f)]",
  poor: "text-[var(--color-error,#dc2626)]",
  unknown: "text-stone-400",
};

const WINDOW_LABEL: Record<NonNullable<ReliabilityPanelProps["window"]>, string> = {
  last7d: "last 7 days",
  last30d: "last 30 days",
  last90d: "last 90 days",
};

function Metric({ label, display }: { label: string; display: UptimeDisplay }) {
  return (
    <div className="flex-1 min-w-[8rem]">
      <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${TONE_CLASS[display.tone]}`}>{display.value}</div>
      {display.caveat && <p className="mt-1 text-xs leading-snug text-stone-500">{display.caveat}</p>}
    </div>
  );
}

export default function ReliabilityPanel({ reliability, window = "last30d" }: ReliabilityPanelProps) {
  // No record reads as no record. We do not fall back to the marketing claim.
  if (!reliability || !reliability.totalObservations) {
    return (
      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Reliability</h2>
        <p className="mt-2 text-sm text-stone-600">
          We haven&apos;t started measuring at this property yet. When we do, the actual
          readings will appear here — including the bad weeks.
        </p>
      </section>
    );
  }

  const data = reliability[window];
  const warning = hotWaterWarning(reliability.hotWaterByHour);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Reliability, measured</h2>
        <span className="text-xs text-stone-500">
          {WINDOW_LABEL[window]} · updated {formatComputedAt(reliability.computedAt)}
        </span>
      </div>

      <p className="mt-1 text-sm text-stone-600">
        These are sensor readings from the property, not our own description of it.
      </p>

      <div className="mt-4 flex flex-wrap gap-5">
        <Metric label="Power" display={formatUptime(data.power)} />
        <Metric label="Hot water" display={formatUptime(data.hotWater)} />
        <Metric label="WiFi" display={formatWifi(data.wifi)} />
      </div>

      {warning && (
        <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-700">{warning}</p>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-stone-500">How this is measured</summary>
        <div className="mt-2 space-y-2 text-xs leading-relaxed text-stone-600">
          <p>
            A device on the property records power state, hot water temperature and
            WiFi speed, and reports them in batches. When the property loses
            connectivity it stores readings locally and sends them once it is back.
          </p>
          <p>
            When we have no reading for a period, we count it as unknown rather than
            as working. Uptime is the share of the time we actually measured, and we
            withhold the figure entirely when we covered less than{" "}
            {reliability.minPublishableCoveragePct}% of a period.
          </p>
          <p>
            WiFi shows the typical speed and the slowest 10% of tests, because an
            average hides the evening when nothing loads.
          </p>
          <p>Based on {reliability.totalObservations.toLocaleString()} readings.</p>
        </div>
      </details>
    </section>
  );
}
