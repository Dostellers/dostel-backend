import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DESTINATIONS, getDestination, getCircuit } from '@/lib/destinations';
import { NODES, KNOWN_FOR } from '@/lib/circuits';
import { getProofConfig } from '@/lib/proof';
import { hostels } from '@/lib/data';
import Reveal from '@/components/Reveal';

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return {};
  return {
    title: `${dest.name} — Dostel`,
    description: `${dest.tagline}. ${dest.blurb}`,
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const houses = hostels.filter((h) => dest.hostelSlugs.includes(h.slug));
  const circuit = getCircuit(dest.circuitId);
  const proof = getProofConfig(dest.terrain);

  // Where this destination sits on its circuit, for the previous/next stops.
  const pos = circuit ? circuit.stops.findIndex((s) => dest.hostelSlugs.includes(s)) : -1;
  const prevStop = circuit && pos > 0 ? circuit.stops[pos - 1] : null;
  const nextStop = circuit && pos >= 0 ? circuit.stops[pos + 1] ?? null : null;

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <span className="stamp text-yellow-300">{dest.state}</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-[2.75rem] leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              {dest.name}
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 max-w-xl text-xl leading-8 text-white/80">{dest.tagline}</p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-5 max-w-2xl leading-8 text-white/65">{dest.blurb}</p>
          </Reveal>
          <Reveal delay={280}>
            <p className="data mt-7 text-xs uppercase tracking-[0.16em] text-white/45">
              {dest.gettingThere}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The house(s) here ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <h2 className="text-3xl text-ink-1000 sm:text-4xl">
            {houses.length === 1 ? 'The house here' : 'The houses here'}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {houses.map((h, i) => {
            const pm = getProofConfig(h.category);
            const measured = pm.checks.filter((c) => c.reading !== null).length;
            return (
              <Reveal key={h.slug} delay={i * 100}>
                <Link
                  href={`/hostels/${h.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div
                    className="aspect-[16/9] w-full bg-ink-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${h.image})` }}
                    role="presentation"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl text-ink-1000">{h.name}</h3>
                    <p className="mt-1 text-sm text-ink-600">{h.location}</p>
                    <p className="mt-3 flex-1 text-sm leading-6 text-ink-700">{h.tagline}</p>
                    <p className="data mt-3 flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-600">
                      <svg className="h-3 w-3 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m4 12.5 5 5L20 6.5" />
                      </svg>
                      {proof.eyebrow} · {measured} of {pm.checks.length} checks measured
                    </p>
                    <div className="mt-4 flex items-end justify-between border-t border-ink-200 pt-4">
                      <div>
                        <span className="data text-xl font-semibold text-ink-1000">₹{h.price}</span>
                        <span className="ml-1 text-xs text-ink-600">/ night</span>
                      </div>
                      <span className="tag">Dosteller ₹{Math.round(h.price * 0.9)}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── On the circuit ───────────────────────────────────── */}
      {circuit && (
        <section className="border-t border-ink-200 bg-ink-1000 py-14 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span className="stamp" style={{ color: circuit.color }}>
                Stop {String(pos + 1).padStart(2, '0')} · {circuit.name}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-2xl text-3xl text-white sm:text-4xl">
                {dest.name} sits on {circuit.name}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-2xl leading-8 text-white/65">{circuit.blurb}</p>
            </Reveal>
            <Reveal delay={220}>
              <div className="data mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                {prevStop && (
                  <>
                    <Link href={`/hostels/${prevStop}`} className="text-white/55 underline-offset-4 hover:underline">
                      ← {NODES[prevStop]?.label}
                    </Link>
                    <span className="text-white/30">·</span>
                  </>
                )}
                <span className="font-semibold text-white">{dest.name}</span>
                {nextStop && (
                  <>
                    <span className="text-white/30">·</span>
                    <Link href={`/hostels/${nextStop}`} className="text-white/55 underline-offset-4 hover:underline">
                      {NODES[nextStop]?.label} ({KNOWN_FOR[nextStop]}) →
                    </Link>
                  </>
                )}
              </div>
            </Reveal>
            <Reveal delay={280}>
              <Link
                href="/#circuits"
                className="mt-8 inline-flex h-11 items-center rounded-sm border border-white/25 px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10"
              >
                See the full route map
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Other destinations ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="data text-xs uppercase tracking-[0.16em] text-ink-600">Keep moving</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {DESTINATIONS.filter((d) => d.slug !== dest.slug).map((d) => (
            <Link
              key={d.slug}
              href={`/destinations/${d.slug}`}
              className="min-h-11 rounded-sm border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors duration-150 hover:border-coral-600 hover:text-coral-700"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
