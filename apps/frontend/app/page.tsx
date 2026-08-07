import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import SplitFlapBoard, { type BoardRow } from '@/components/SplitFlapBoard';
import Reveal from '@/components/Reveal';
import CircuitMap from '@/components/CircuitMap';
import { hostels } from '@/lib/data';
import { KNOWN_FOR } from '@/lib/circuits';

/* Dostel is a network of eight properties, so the board is a departure board
   for the whole country rather than one property's noticeboard — which is what
   a split-flap board actually is. Rows are derived from real inventory. */
const network = hostels.filter((h) => h.slug.startsWith('dostel-'));

const boardRows: BoardRow[] = network.slice(0, 6).map((h) => ({
  what: h.location.split(',')[0]?.trim() || h.name,
  where: KNOWN_FOR[h.slug] || h.category,
  when: `₹${h.price}`,
  status: h.isTrending ? 'Filling' : 'Open',
  live: h.isTrending,
}));

/* Only frames that match the terrain we actually operate in. Still stock —
   real photography of these eight properties is the outstanding gap. */
const stripPhotos = [
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80',
];

/* Facts about the network, not about one hill. */
const stripFacts = [
  ['8 hostels', 'hills, coast, and old cities'],
  ['From ₹327', 'a night, all in'],
  ['Since 1985', 'the first one, in Vattakanal'],
  ['One standard', 'measured the same way everywhere'],
];

const terrainLabel: Record<string, string> = {
  mountains: 'Mountains',
  beach: 'Coast',
  city: 'City',
  jungle: 'Forest',
  heritage: 'Old city',
  workation: 'Work stay',
};

export default function HomePage() {
  return (
    <div className="bg-paper">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-1000 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: 'radial-gradient(circle, #F54E4E 0%, transparent 68%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          {/* min-w-0 on both columns is load-bearing: grid children default to
              min-width:auto, so the board’s min-w-[35rem] would stretch the
              column to 720px and the section's overflow-hidden would silently
              clip the headline copy on mobile instead of wrapping it. */}
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.02fr] lg:gap-16">
            <div className="min-w-0">
              <Reveal>
                <span className="stamp text-yellow-300">
                  <span style={{ fontFamily: 'var(--font-deva)' }}>दोस्त</span> + hostel
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-6 text-[3.25rem] leading-[0.92] tracking-[-0.035em] text-white sm:text-7xl lg:text-[5.25rem]">
                  Arrive a<br />stranger.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                  {`${network.length} hostels across India`} — staff who learn your name,
                  Wi-Fi that&apos;s measured instead of claimed, and a board that shows
                  who&apos;s in the room before you book.
                </p>
              </Reveal>

              {/* Search lives inside the reading path — name, claim, act — not in
                  a floating light-mode card orphaned below the composition. */}
              <Reveal delay={240} className="mt-9 max-w-xl">
                <SearchBar variant="home" dark />
                <p className="data mt-4 text-xs uppercase tracking-[0.16em] text-white/40">
                  From ₹327 a night · Free cancellation 48h
                </p>
              </Reveal>
            </div>

            <Reveal delay={200} className="min-w-0">
              <SplitFlapBoard
                rows={boardRows}
                title="Departures · tonight"
                columns={['Where', 'Known for', 'From', 'Tonight']}
                caption="Dostel properties across India, nightly rate and availability"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── The network, moving ─────────────────────────────── */}
      <section className="overflow-hidden border-y border-ink-200 bg-ink-1000 py-3" aria-label="The Dostel network at a glance">
        <div className="animate-marquee-slow gap-3">
          {[0, 1, 2].map((pass) =>
            stripPhotos.map((src, i) => (
              <div key={`${pass}-${i}`} className="flex shrink-0 gap-3">
                <div
                  className="h-40 w-64 shrink-0 rounded-sm bg-ink-900 bg-cover bg-center sm:h-52 sm:w-80"
                  style={{ backgroundImage: `url(${src})` }}
                  role="presentation"
                />
                <div className="flex h-40 w-56 shrink-0 flex-col justify-end rounded-sm border border-white/12 p-5 sm:h-52 sm:w-64">
                  <span className="text-2xl leading-tight text-yellow-300 sm:text-3xl">
                    {stripFacts[i]?.[0]}
                  </span>
                  <span className="mt-1.5 text-sm leading-6 text-white/55">
                    {stripFacts[i]?.[1]}
                  </span>
                </div>
              </div>
            )),
          )}
        </div>
      </section>

      {/* ── Thesis ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <h2 className="max-w-3xl text-[2.25rem] leading-[1.06] tracking-[-0.03em] text-ink-1000 sm:text-5xl">
            Every hostel sells you a bed.
            <span className="block text-coral-700">We introduce you to the room.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              head: 'Measured, not claimed',
              body: 'Every property publishes what was checked, when, and by what method — and marks it “not measured” where we have no reading we can stand behind. The checks change with the terrain; the standard does not.',
              href: '/hostels',
              cta: 'See a stay card',
            },
            {
              head: 'Know the room first',
              body: 'Guests choose what to share before they arrive: who is trekking Friday, who is working India hours, who is teaching something on Saturday. Opt-in, first names, cleared at checkout.',
              href: '/hostels',
              cta: 'Browse the network',
            },
            {
              head: 'No points, no wallet',
              body: 'Dostellers is not a currency you grind for. Stay across the network and the people at the next one already know how you take your chai. That is the whole mechanic.',
              href: '/dostellers',
              cta: 'About Dostellers',
            },
          ].map((item, i) => (
            <Reveal key={item.head} delay={i * 110}>
              <div className="flex h-full flex-col">
                <h3 className="text-xl text-ink-1000">{item.head}</h3>
                <p className="mt-3 flex-1 leading-7 text-ink-700">{item.body}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 border-b-2 border-coral-600 pb-0.5 text-sm font-semibold text-coral-700 transition-colors hover:border-coral-700 hover:text-coral-800"
                >
                  {item.cta}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The circuits ─────────────────────────────────────
          A traveller plans a direction, not a stay. The map is the
          aggregator's native artifact: routes between the houses, real
          transport legs, and one identity that travels the line with you.
          The landing does not duplicate /hostels — the grid lives there. */}
      <section className="border-t border-ink-200 bg-ink-1000 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="stamp text-yellow-300">The circuits</span>
                <h2 className="mt-4 text-[2.25rem] leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl">
                  Plan the route,<br />not the room.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/70">
                  Nobody backpacks one address. Three circuits link the eight houses —
                  and because it&apos;s one network, the next hostel already knows your
                  name when you walk in.
                </p>
              </div>
              <Link href="/hostels" className="text-sm font-semibold text-yellow-300 underline-offset-4 hover:underline">
                Or browse all {network.length}
              </Link>
            </div>
          </Reveal>

          <div className="mt-12">
            <CircuitMap />
          </div>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="bg-ink-1000 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-[2.5rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl">
              Leave with{' '}
              <span className="text-yellow-logo" style={{ fontFamily: 'var(--font-deva)' }}>दोस्त</span>
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-6 max-w-xl leading-8 text-white/70">
              Hills, coast, or the middle of a city. A weekend or a month — there is a bed,
              a fire, and people who will know your name by the second morning.
            </p>
          </Reveal>
          <Reveal delay={170}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/hostels"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-coral-600 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
              >
                Find a bed
              </Link>
              <Link
                href="/dostellers"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-white/25 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.97]"
              >
                Become a Dosteller
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
