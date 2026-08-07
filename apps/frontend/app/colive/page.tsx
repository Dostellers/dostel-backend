import Link from 'next/link';
import type { Metadata } from 'next';
import { hostels } from '@/lib/data';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Colive — Dostel',
  description:
    'Stay by the month at real Dostel properties. Long-stay rates, one room that stays yours, and a house that learns your name.',
};

/* The old page advertised three "Dostel Colive" properties that do not exist
   in inventory. This page sells only what we operate: monthly stays at real
   houses, at long-stay rates derived from real nightly prices. */
const COLIVE_SLUGS = ['dostel-bangalore-hsr', 'dostel-vattakanal', 'dostel-coorg-rainforest', 'dostel-goa-beach'];

const COLIVE_PITCH: Record<string, string> = {
  'dostel-bangalore-hsr': 'The commuter option — live here, work anywhere in the city.',
  'dostel-vattakanal': 'The original long-stay house. 14+ nights is how Dostellers started.',
  'dostel-coorg-rainforest': 'A month of green. Best in the dry season, honest about the wet one.',
  'dostel-goa-beach': 'Season-dependent: glorious Nov–Feb, monsoon-quiet the rest.',
};

/** Long-stay maths, stated plainly: ~20% off nightly past 7 nights. */
const monthly = (nightly: number) => Math.round(nightly * 30 * 0.8);

const truths = [
  {
    head: 'One bed, held for you',
    body: 'A monthly stay is the same bed the whole month — no re-checking in, no shuffling dorms, your things stay where you left them.',
  },
  {
    head: 'The rate is the nightly rate, discounted',
    body: 'Long-stay pricing is roughly 20% off the public nightly rate past seven nights. No separate “colive product” with separate fine print.',
  },
  {
    head: 'A month is how you stop being a guest',
    body: 'Fourteen nights is where Dostellers came from. Stay a month and the staff know your order, your work hours, and when to drag you to a bonfire.',
  },
];

export default function ColivePage() {
  const houses = COLIVE_SLUGS.map((s) => hostels.find((h) => h.slug === s)).filter(
    (h): h is NonNullable<typeof h> => Boolean(h),
  );

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <span className="stamp text-yellow-300">Colive</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
              Stay a month.<br />Stop being a guest.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Monthly stays at the same houses everyone else visits for a weekend — at
              long-stay rates, with a bed that stays yours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
          {truths.map((t, i) => (
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

      <section className="border-t border-ink-200 bg-coral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl text-ink-1000 sm:text-4xl">Houses that take monthly stays</h2>
            <p className="mt-3 max-w-xl leading-7 text-ink-700">
              Estimated from the public nightly rate — the checkout applies the exact
              long-stay discount to your dates.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {houses.map((h, i) => (
              <Reveal key={h.slug} delay={(i % 4) * 90}>
                <Link
                  href={`/hostels/${h.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div
                    className="aspect-[4/3] w-full bg-ink-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${h.image})` }}
                    role="presentation"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg leading-tight text-ink-1000">{h.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ink-700">{COLIVE_PITCH[h.slug]}</p>
                    <div className="mt-4 border-t border-ink-200 pt-4">
                      <p>
                        <span className="data text-xl font-semibold text-ink-1000">
                          ~₹{monthly(h.price).toLocaleString('en-IN')}
                        </span>
                        <span className="ml-1 text-xs text-ink-600">/ month, dorm</span>
                      </p>
                      <p className="data mt-1 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-500">
                        vs ₹{h.price}/night short-stay
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <p className="data mt-8 text-xs leading-5 text-ink-600">
              Private rooms and suites by the month exist at Vattakanal and Bangalore —
              ask when booking. Monthly estimates are dorm-bed maths, not a quote.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink-1000 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl text-white sm:text-4xl">Fourteen nights is the door</h2>
            <p className="mx-auto mt-4 max-w-xl leading-8 text-white/70">
              Stay 14+ nights in a month anywhere on the network and Dostellers opens:
              long-stay rates everywhere, and a name that travels with you.
            </p>
            <Link
              href="/dostellers"
              className="mt-8 inline-flex h-12 items-center rounded-sm bg-yellow-400 px-7 text-sm font-semibold text-ink-1000 transition-all duration-150 hover:bg-yellow-300 active:scale-[0.97]"
            >
              About Dostellers
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
