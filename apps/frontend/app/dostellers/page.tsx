import Link from 'next/link';
import type { Metadata } from 'next';
import { dostellerTiers } from '@/lib/data';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Dostellers — Dostel',
  description:
    'No points, no wallet, no quests. Stay long enough and the network knows you — that is the whole mechanic.',
};

/* The anti-casino. Zostel gamifies with $Zo currency and quests; Dostellers'
   counter-position is that being known is not a score. Tier metallics stay
   accents on tints, never text backgrounds (design-tokens: not-casino rule). */

const graph = [
  {
    head: 'Your name checks in before you do',
    body: 'Check out of Vattakanal, walk into Gokarna: they know your chai order, that you sleep light, and that you fixed the guitar last time. Staff memory, made a system — with your consent, and only what you chose to share.',
  },
  {
    head: 'Recognition is earned, not bought',
    body: 'There is no wallet to top up and no quest log. Nights stayed and things done — a skill-share taught, a trek led — are the only ledger.',
  },
  {
    head: 'Leave whenever. It keeps.',
    body: 'Come back after a year and you are not a stranger. The graph does not expire, and deleting it takes one message — it is yours.',
  },
];

const TIER_ACCENT: Record<string, string> = {
  bronze: 'var(--color-bronze)',
  silver: 'var(--color-silver)',
  gold: 'var(--color-gold)',
};

export default function DostellersPage() {
  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <span className="stamp text-yellow-300">Dostellers</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl text-[2.75rem] leading-[0.95] tracking-[-0.035em] text-white sm:text-7xl">
              No points.<br />No wallet.<br />
              <span className="text-yellow-logo">You&apos;re known.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Every loyalty program turns you into a balance. Dostellers turns eight
              hostels into places where somebody remembers you.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dostellers/join"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-coral-600 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
              >
                Join — free at Bronze
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-white/25 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.97]"
              >
                Already a Dosteller
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The graph, plainly ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
          {graph.map((g, i) => (
            <Reveal key={g.head} delay={i * 100}>
              <div>
                <p className="data text-xs uppercase tracking-[0.16em] text-coral-700">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-3 text-xl text-ink-1000">{g.head}</h2>
                <p className="mt-3 leading-7 text-ink-700">{g.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Tiers ────────────────────────────────────────────── */}
      <section className="border-t border-ink-200 bg-coral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl text-ink-1000 sm:text-4xl">Three tiers, no grinding</h2>
            <p className="mt-3 max-w-xl leading-7 text-ink-700">
              Bronze is free forever. The paid tiers are a discount you can do the maths
              on, not a status game.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dostellerTiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 100}>
                <div
                  className={`flex h-full flex-col rounded-sm border bg-white p-6 ${
                    tier.highlighted ? 'border-coral-600 shadow-[0_16px_40px_-24px_rgba(212,42,50,0.45)]' : 'border-ink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="stamp"
                      style={{ color: TIER_ACCENT[tier.id] || 'var(--color-ink-600)' }}
                    >
                      {tier.name}
                    </span>
                    {tier.highlighted && <span className="tag">Most joined</span>}
                  </div>
                  <p className="mt-5">
                    <span className="data text-3xl font-semibold text-ink-1000">
                      {tier.price === 0 ? 'Free' : `₹${tier.price.toLocaleString('en-IN')}`}
                    </span>
                    {tier.price > 0 && <span className="ml-1 text-sm text-ink-600">{tier.period}</span>}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-700">{tier.description}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm leading-6 text-ink-900">
                        <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m4 12.5 5 5L20 6.5" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/dostellers/join?tier=${tier.id}`}
                    className={`mt-6 inline-flex h-11 items-center justify-center rounded-sm px-6 text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
                      tier.highlighted
                        ? 'bg-coral-600 text-white hover:bg-coral-700'
                        : 'border border-ink-300 text-ink-900 hover:border-ink-1000'
                    }`}
                  >
                    {tier.ctaLabel}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <p className="data mt-8 text-xs leading-5 text-ink-600">
              Or skip all of this: stay 14+ nights in a month anywhere on the network and
              Bronze finds you on its own.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── On the bench ─────────────────────────────────────
          A public roadmap is a promise made where users can hold us to
          it — the opposite of shipping fake UI. Each card maps to a real
          spec in .paperclip/issues; nothing here pretends to work yet. */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <span className="stamp text-coral-700">On the bench</span>
          <h2 className="mt-4 text-3xl text-ink-1000 sm:text-4xl">
            What we&apos;re building next. Hold us to it.
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-ink-700">
            These ship when the guest graph lands. Marked plainly as in design —
            we would rather show the plan than fake the feature.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              ref: 'DOS-505',
              head: 'Paths crossed',
              body: 'Shared a dorm in March? Get a nudge when they check in one town over — names revealed only when you both say yes, silence if either says no.',
            },
            {
              ref: 'DOS-506',
              head: 'Your names for people',
              body: '“Guitar Guy · Vattakanal, March.” Private nicknames only you can see, because nobody remembers hostel friends by their legal name.',
            },
            {
              ref: 'DOS-507',
              head: 'First-night buddy & the strangers’ table',
              body: 'Arrive alone, never eat alone — a table where sitting down means “talk to me”, and a buddy who was new here yesterday. With a quiet signal for the nights you’d rather read.',
            },
          ].map((item, i) => (
            <Reveal key={item.ref} delay={i * 100}>
              <div className="flex h-full flex-col rounded-sm border border-dashed border-ink-300 bg-white p-6">
                <p className="data text-[0.625rem] uppercase tracking-[0.18em] text-ink-500">
                  In design · {item.ref}
                </p>
                <h3 className="mt-3 text-xl text-ink-1000">{item.head}</h3>
                <p className="mt-3 flex-1 leading-7 text-ink-700">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────── */}
      <section className="bg-ink-1000 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl text-white sm:text-5xl">
              The next hostel already knows you
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-8 text-white/70">
              That&apos;s the whole product. Everything you share is opt-in, first names
              only on public boards, cleared whenever you say so.
            </p>
            <Link
              href="/dostellers/join"
              className="mt-8 inline-flex h-12 items-center rounded-sm bg-coral-600 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
            >
              Become a Dosteller
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
