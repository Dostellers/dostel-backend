import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import SplitFlapBoard, { type BoardRow } from '@/components/SplitFlapBoard';
import Reveal from '@/components/Reveal';

/* What is actually happening at the property. The board is only worth having
   if it carries real content — a decorative departure board is a gimmick. */
const boardRows: BoardRow[] = [
  { what: 'Sunrise trek', where: "Dolphin's Nose", when: '05:30', status: '4 spots', live: true },
  { what: 'Bonfire', where: 'Common deck', when: '19:30', status: 'Open', live: true },
  { what: 'Skill share', where: "Altaf's cafe", when: '20:00', status: '2 spots', live: true },
  { what: 'Market run', where: 'Kodaikanal', when: '09:00', status: 'Full' },
  { what: 'Quiet hours', where: 'Whole house', when: '23:00', status: 'Daily' },
];

/* Only the hill/hostel frames from the curated set. The Goa beach and the
   generic hotel-room stock that were here read as any-travel-brand filler —
   a Kodaikanal hostel showing a tropical beach is the "generic photos"
   anti-pattern. These still need replacing with real Vattakanal photography. */
const stripPhotos = [
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80',
];

/* Typographic panels between the photos: facts about the place carry more
   than another stock frame, and they keep the strip honest where our
   photography is still thin. */
const stripFacts = [
  ['2,100 m', 'above sea level'],
  ['Shola forest', 'and the mist that lives in it'],
  ['5 min', 'downhill to the village'],
  ['Since 1985', 'Bob & Tanya restored this land'],
];

const rooms = [
  { name: 'Dorms', slug: 'dostel-vattakanal', copy: 'Six beds, a locker each, and a curtain when you want out of the conversation.', price: 327, dosteller: 294 },
  { name: 'Couple rooms', slug: 'dostel-vattakanal', copy: 'A door that closes, an attached bath, and the valley out the window.', price: 1299, dosteller: 1169 },
  { name: 'Private suites', slug: 'dostel-vattakanal', copy: 'Room to unpack properly if you are staying past the weekend.', price: 1799, dosteller: 1619 },
];

export default function HomePage() {
  return (
    <div className="bg-paper">
      {/* ── Hero ────────────────────────────────────────────────
          The board is the thesis: a hostel is a place things are
          happening, not a grid of beds. */}
      <section className="relative overflow-hidden bg-ink-1000 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: 'radial-gradient(circle, #F54E4E 0%, transparent 68%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          {/* min-w-0 on both columns is load-bearing: grid children default to
              min-width:auto, so the board's min-w-[45rem] would stretch the
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
                  A hostel in the Kodaikanal hills where the staff remember your name, the
                  Wi-Fi speed is measured instead of claimed, and you can see who is in the
                  room before you book.
                </p>
              </Reveal>

            </div>

            <Reveal delay={200} className="min-w-0">
              <SplitFlapBoard rows={boardRows} />
            </Reveal>
          </div>

          {/* Search gets its own full-width band. Sharing a column with the
              board made it overflow its container and collide with the flaps. */}
          <Reveal delay={300} className="mt-14 lg:mt-16">
            <SearchBar variant="home" />
            <p className="data mt-4 text-center text-xs uppercase tracking-[0.16em] text-white/40">
              From ₹327 a night · Free cancellation 48h
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The place, moving ─────────────────────────────────
          Photos alternating with typographic panels: a fact about the
          place earns its slot more than another stock frame does. */}
      <section className="overflow-hidden border-y border-ink-200 bg-ink-1000 py-3" aria-label="Vattakanal at a glance">
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
              body: 'Wi-Fi speed, power backup and carrier signal are published with the time and method of the check — and marked “not measured” when we have no reading we can stand behind.',
              href: '/hostels/dostel-vattakanal',
              cta: 'See the hill-stay card',
            },
            {
              head: 'Know the room first',
              body: 'Guests choose what to share before they arrive: who is trekking Friday, who is working India hours, who is teaching something on Saturday. Opt-in, first names, cleared at checkout.',
              href: '/hostels/dostel-vattakanal',
              cta: "See who's here",
            },
            {
              head: 'No points, no wallet',
              body: 'Dostellers is not a currency you grind for. Stay long enough and the people here know how you take your chai. That is the whole mechanic.',
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

      {/* ── Rooms ───────────────────────────────────────────── */}
      <section className="border-t border-ink-200 bg-coral-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[2.25rem] leading-[1.06] tracking-[-0.03em] text-ink-1000 sm:text-5xl">
                Three ways to stay
              </h2>
              <Link href="/hostels" className="text-sm font-semibold text-coral-700 underline-offset-4 hover:underline">
                All hostels
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rooms.map((room, i) => (
              <Reveal key={room.name} delay={i * 110}>
                <Link
                  href={`/hostels/${room.slug}`}
                  className="group flex h-full flex-col justify-between rounded-sm border border-ink-200 bg-white p-7 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div>
                    <h3 className="text-2xl text-ink-1000">{room.name}</h3>
                    <p className="mt-3 leading-7 text-ink-700">{room.copy}</p>
                  </div>
                  <div className="mt-8 flex items-end justify-between gap-3">
                    <div>
                      <span className="data text-2xl font-semibold text-ink-1000">₹{room.price}</span>
                      <span className="ml-1 text-sm text-ink-600">/ night</span>
                    </div>
                    <span className="tag">Dosteller ₹{room.dosteller}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
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
              Vattakanal, in the Kodaikanal hills. A weekend or a month — there is a bed, a
              fire, and people who will know your name by the second morning.
            </p>
          </Reveal>
          <Reveal delay={170}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/hostels/dostel-vattakanal"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-coral-600 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
              >
                Check availability
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
