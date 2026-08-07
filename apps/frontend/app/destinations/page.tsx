import Link from 'next/link';
import type { Metadata } from 'next';
import { DESTINATIONS } from '@/lib/destinations';
import { getCircuit } from '@/lib/destinations';
import { hostels } from '@/lib/data';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Destinations — Dostel',
  description:
    'Eight places the network operates: hills, coast, forests and old cities across India.',
};

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <span className="stamp text-yellow-300">Destinations</span>
          <h1 className="mt-5 max-w-3xl text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
            Eight places to be a stranger.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
            Only places where the network actually has beds — no aspirational pins on a
            map. Each one sits on a circuit or starts one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((d, i) => {
            const house = hostels.find((h) => d.hostelSlugs.includes(h.slug));
            const circuit = getCircuit(d.circuitId);
            return (
              <Reveal key={d.slug} delay={(i % 4) * 80}>
                <Link
                  href={`/destinations/${d.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div
                    className="aspect-[4/3] w-full bg-ink-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${house?.image})` }}
                    role="presentation"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    {circuit && (
                      <span className="data flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.16em] text-ink-500">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: circuit.color === '#FFFFFF' ? '#908B8A' : circuit.color }} />
                        {circuit.name}
                      </span>
                    )}
                    <h2 className="mt-2 text-lg leading-tight text-ink-1000">{d.name}</h2>
                    <p className="mt-1 flex-1 text-sm leading-6 text-ink-700">{d.tagline}</p>
                    {house && (
                      <p className="data mt-4 border-t border-ink-200 pt-3 text-xs text-ink-600">
                        From <span className="font-semibold text-ink-1000">₹{house.price}</span> / night
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
