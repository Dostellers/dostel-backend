import Link from 'next/link';
import type { Metadata } from 'next';
import { hostels } from '@/lib/data';
import { getProofConfig } from '@/lib/proof';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Workations — Dostel',
  description:
    'Work from the network. Wi-Fi that is measured instead of claimed, quiet hours that are enforced, and an honest list of what is not included.',
};

/* Work-suitability is a claim, so it is scoped: these are the properties we
   are prepared to say you can do a real work week from, and why. The old page
   promised "dedicated fiber" and ergonomic chairs nobody has verified. */
const WORK_SLUGS = ['dostel-bangalore-hsr', 'dostel-vattakanal', 'dostel-coorg-rainforest'];

const WORK_PITCH: Record<string, string> = {
  'dostel-bangalore-hsr': 'City base. Normal weekday rhythm, best transit of the three.',
  'dostel-vattakanal': 'The Workweek runs here — 5 nights, meals, and a skill-share.',
  'dostel-coorg-rainforest': 'Deep-work mode. Expect to be offline on the trails, on purpose.',
};

const deskTruths = [
  {
    head: 'The connection is a reading, not a promise',
    body: 'Every property publishes its Wi-Fi check — method, time, result. Where we have no operator-validated reading yet, the stay card says “not measured” instead of inventing a number. You deserve to know before you bet a work week on it.',
  },
  {
    head: 'Quiet hours are policy, not vibes',
    body: '23:00 in dorms and common areas, enforced. Calls after hours move to the deck. A hostel that wants your laptop money owes you a night of sleep.',
  },
  {
    head: 'A desk means a socket within reach',
    body: 'We count seats with power, not “vibrant co-working energy”. The count per property joins its stay card as it gets measured.',
  },
];

const notIncluded = [
  'A meeting room — the cafe works for 1:1s',
  'A printed lanyard, a community manager, or productivity theatre',
  'Guaranteed video-call quality during evening peak — check the reading',
];

export default function WorkationsPage() {
  const workHouses = WORK_SLUGS.map((s) => hostels.find((h) => h.slug === s)).filter(
    (h): h is NonNullable<typeof h> => Boolean(h),
  );

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <span className="stamp text-yellow-300">Workations</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
              Bring the laptop.<br />We&apos;ll prove the Wi-Fi.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Most workation pages promise “blazing connectivity”. Ours publishes the
              speed test — and admits where we haven&apos;t run it yet.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The desk truths ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
          {deskTruths.map((t, i) => (
            <Reveal key={t.head} delay={i * 100}>
              <div>
                <p className="data text-xs uppercase tracking-[0.16em] text-coral-700">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-3 text-xl text-ink-1000">{t.head}</h2>
                <p className="mt-3 leading-7 text-ink-700">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Where to work from ───────────────────────────────── */}
      <section className="border-t border-ink-200 bg-coral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl text-ink-1000 sm:text-4xl">Where a work week actually works</h2>
            <p className="mt-3 max-w-xl leading-7 text-ink-700">
              Three of the eight, chosen deliberately — not every hostel in the network is
              a good office, and we would rather say so.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {workHouses.map((h, i) => {
              const pc = getProofConfig(h.category);
              const measured = pc.checks.filter((c) => c.reading !== null).length;
              return (
                <Reveal key={h.slug} delay={i * 100}>
                  <Link
                    href={`/hostels/${h.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <div
                      className="aspect-[16/10] w-full bg-ink-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${h.image})` }}
                      role="presentation"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg text-ink-1000">{h.name}</h3>
                      <p className="mt-1 flex-1 text-sm leading-6 text-ink-700">{WORK_PITCH[h.slug]}</p>
                      <p className="data mt-3 flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-600">
                        <svg className="h-3 w-3 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m4 12.5 5 5L20 6.5" />
                        </svg>
                        {measured} of {pc.checks.length} checks measured
                      </p>
                      <div className="mt-4 flex items-end justify-between border-t border-ink-200 pt-4">
                        <div>
                          <span className="data text-xl font-semibold text-ink-1000">₹{h.price}</span>
                          <span className="ml-1 text-xs text-ink-600">/ night</span>
                        </div>
                        <span className="tag">Long-stay rates</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The Workweek + honesty box ───────────────────────── */}
      <section className="bg-ink-1000 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <div>
                <span className="stamp text-yellow-300">The Workweek</span>
                <h2 className="mt-4 text-3xl text-white sm:text-4xl">
                  Five nights of focus, fire and community
                </h2>
                <p className="mt-4 max-w-xl leading-8 text-white/70">
                  Sunday to Thursday at Vattakanal: a quiet room, three meals a day at
                  Altaf&apos;s, one group trek, one bonfire, and a 90-minute skill-share
                  taught by whoever in the room knows something worth teaching.
                </p>
                <Link
                  href="/hostels/dostel-vattakanal?workweek=true"
                  className="mt-7 inline-flex h-12 items-center rounded-sm bg-coral-600 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
                >
                  See Workweek rates
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-sm border border-white/15 p-6">
                <h3 className="data text-xs uppercase tracking-[0.16em] text-white/50">
                  What&apos;s not included
                </h3>
                <ul className="mt-4 space-y-3">
                  {notIncluded.map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-white/70">
                      <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-white/40" />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="data mt-5 border-t border-white/10 pt-4 text-[0.6875rem] leading-5 text-white/40">
                  Rates, meal inclusions and internet readings require operator validation
                  before publishing. Nothing on this page is a measured claim yet.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
