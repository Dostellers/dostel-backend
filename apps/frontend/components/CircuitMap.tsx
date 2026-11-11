'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { LandingCircuit, LandingHostelNode } from '@/lib/landing'

/**
 * Circuit map driven by landingPage.circuits + hostelNodes (admin CMS).
 * Callers: apps/frontend/app/page.tsx.
 * Replaces static CIRCUITS/NODES/KNOWN_FOR from lib/circuits + lib/data.
 * User: "make it dynamic and controlled via the admin panel… no static data."
 */

type Props = {
  circuits: LandingCircuit[]
  hostelNodes: LandingHostelNode[]
}

function polyline (stops: string[], nodes: Record<string, LandingHostelNode>) {
  return stops
    .map((s) => {
      const n = nodes[s]
      return `${n?.mapX ?? 0},${n?.mapY ?? 0}`
    })
    .join(' ')
}

export default function CircuitMap ({ circuits, hostelNodes }: Props) {
  const nodes = Object.fromEntries(hostelNodes.map((h) => [h.slug, h]))
  const mapped = hostelNodes.filter(
    (h) => typeof h.mapX === 'number' && typeof h.mapY === 'number'
  )
  const [active, setActive] = useState(circuits[0]?.id ?? '')

  if (!circuits.length || !mapped.length) {
    return (
      <p className="rounded-sm border border-white/15 px-5 py-8 text-sm text-white/55">
        Circuits appear here once hostels have map positions and routes are set in the admin landing panel.
      </p>
    )
  }

  const price = (slug: string) => nodes[slug]?.pricePerNight ?? 0
  const label = (slug: string) => nodes[slug]?.city || nodes[slug]?.name || slug
  const knownFor = (slug: string) => nodes[slug]?.knownFor || ''

  return (
    <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16">
      <div className="relative order-last min-w-0 lg:order-first">
        <svg
          viewBox="0 0 400 720"
          className="mx-auto h-[30rem] w-auto max-w-full sm:h-[36rem] lg:h-[40rem]"
          role="img"
          aria-label="Route map of Dostel circuits"
        >
          {[89, 183, 227, 522, 549, 604, 661].map((y) => (
            <line key={y} x1="16" x2="384" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="1 5" />
          ))}
          <text x="20" y="34" className="fill-white/30" fontSize="11" fontFamily="var(--font-data)" letterSpacing="2">
            N ↑
          </text>
          <text x="380" y="708" textAnchor="end" className="fill-white/25" fontSize="10" fontFamily="var(--font-data)" letterSpacing="1.5">
            NOT TO SCALE · ROUTES ONLY
          </text>

          {circuits.filter((c) => c.id !== active).map((c) => (
            <polyline
              key={c.id}
              points={polyline(c.stops, nodes)}
              fill="none"
              stroke={c.color}
              strokeOpacity="0.18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {circuits.filter((c) => c.id === active).map((c) => (
            <polyline
              key={c.id}
              points={polyline(c.stops, nodes)}
              fill="none"
              stroke={c.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="7 5"
            >
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.6s" repeatCount="indefinite" />
            </polyline>
          ))}

          {mapped.map((n) => {
            const inActive = circuits.find((c) => c.id === active)?.stops.includes(n.slug)
            const labelLeft = (n.mapX || 0) > 235
            return (
              <g key={n.slug}>
                <circle
                  cx={n.mapX!}
                  cy={n.mapY!}
                  r="6.5"
                  fill="#0B0B0C"
                  stroke={inActive ? '#FCCC00' : 'rgba(255,255,255,0.45)'}
                  strokeWidth="2.5"
                />
                {inActive && <circle cx={n.mapX!} cy={n.mapY!} r="2.5" fill="#FCCC00" />}
                <text
                  x={labelLeft ? n.mapX! - 14 : n.mapX! + 14}
                  y={n.mapY! + 4}
                  textAnchor={labelLeft ? 'end' : 'start'}
                  className={inActive ? 'fill-white' : 'fill-white/55'}
                  fontSize="13"
                  fontFamily="var(--font-data)"
                  letterSpacing="1"
                >
                  {label(n.slug).toUpperCase()}
                </text>
                <text
                  x={labelLeft ? n.mapX! - 14 : n.mapX! + 14}
                  y={n.mapY! + 18}
                  textAnchor={labelLeft ? 'end' : 'start'}
                  className="fill-white/35"
                  fontSize="10"
                  fontFamily="var(--font-data)"
                  letterSpacing="1"
                >
                  ₹{price(n.slug)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="min-w-0">
        <div className="space-y-3">
          {circuits.map((c) => {
            const isActive = c.id === active
            const total = c.stops.reduce((sum, s) => sum + Number(price(s) || 0), 0)
            return (
              <div
                key={c.id}
                className={`rounded-sm border transition-colors duration-150 ${
                  isActive ? 'border-white/30 bg-white/[0.05]' : 'border-white/12'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  aria-expanded={isActive}
                  className="flex min-h-12 w-full items-center gap-3 px-5 py-4 text-left"
                >
                  <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                  <span className="flex-1 text-lg font-semibold text-white">{c.name}</span>
                  <span className="data hidden text-[0.6875rem] uppercase tracking-[0.14em] text-white/45 sm:block">
                    {c.stops.length} stops · {c.nights}
                  </span>
                </button>

                <div className={isActive ? 'block px-5 pb-5' : 'hidden'}>
                  <p className="leading-7 text-white/65">{c.blurb}</p>
                  <ol className="mt-4">
                    {c.stops.map((slug, i) => (
                      <li key={slug}>
                        <Link
                          href={`/hostels/${slug}`}
                          className="group flex items-baseline justify-between gap-3 py-2"
                        >
                          <span className="flex min-w-0 items-baseline gap-2.5">
                            <span className="data text-[0.6875rem] text-white/35">{String(i + 1).padStart(2, '0')}</span>
                            <span className="truncate font-medium text-white underline-offset-4 group-hover:underline">
                              {label(slug)}
                            </span>
                            <span className="hidden truncate text-sm text-white/45 sm:inline">{knownFor(slug)}</span>
                          </span>
                          <span className="data shrink-0 text-sm text-white/70">
                            ₹{price(slug)}
                            <span className="text-white/40">/n</span>
                          </span>
                        </Link>
                        {c.legs[i] && (
                          <p className="data ml-7 border-l border-white/15 py-1 pl-3 text-[0.6875rem] uppercase tracking-[0.14em] text-white/40">
                            ↓ {c.legs[i]}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="data text-xs uppercase tracking-[0.12em] text-white/50">
                      From ₹{total.toLocaleString('en-IN')} · one night at each stop
                    </p>
                    <Link
                      href="/hostels"
                      className="inline-flex h-10 items-center rounded-sm bg-coral-600 px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-coral-500"
                    >
                      See these hostels
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="data mt-5 text-xs leading-5 text-white/40">
          One account across the network — check out of one house and the next
          already knows your name, your chai, and who you trekked with.
        </p>
      </div>
    </div>
  )
}
