/* Callers: apps/frontend/app/design/page.tsx imports DesignSystemClient (line ~20).
   No existing DesignSystemClient or /design gallery — new living specimen page.
   Schema: none (clipboard writeText only; no DB/API).
   User: "Build a design system for dostel at dosteller.com/design" */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import DateRangeField from '@/components/ui/DateRangeField'
import DestinationField from '@/components/ui/DestinationField'
import GuestSelect from '@/components/ui/GuestSelect'

const SECTIONS = [
  { id: 'concept', label: 'Concept' },
  { id: 'learn', label: 'Learn' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'space', label: 'Space' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'action', label: 'Action' },
  { id: 'fields', label: 'Fields' },
  { id: 'search', label: 'Search' },
  { id: 'property', label: 'Property' },
  { id: 'social', label: 'Social' },
  { id: 'components', label: 'Components' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'never', label: 'Never' },
] as const

const SPACING = [
  { token: '1', px: '4', use: 'Hairline gaps · icon padding' },
  { token: '2', px: '8', use: 'Tight chip / stamp gap' },
  { token: '3', px: '12', use: 'Inline control padding' },
  { token: '4', px: '16', use: 'Card inner rhythm' },
  { token: '6', px: '24', use: 'Section block padding' },
  { token: '8', px: '32', use: 'Stack between modules' },
  { token: '12', px: '48', use: 'Page section breathing' },
  { token: '16', px: '64', use: 'Hero / chapter break' },
]

const ELEVATION = [
  { name: 'flat', shadow: 'none', use: 'Paper ground · stamps · tags' },
  { name: 'raised', shadow: '0 1px 2px rgba(11,11,12,0.06)', use: 'Inputs · secondary surfaces' },
  { name: 'float', shadow: '0 8px 24px -12px rgba(11,11,12,0.25)', use: 'Hover cards · menus' },
  { name: 'board', shadow: '0 18px 40px -24px rgba(11,11,12,0.5)', use: 'Pinned board cards · modals' },
]

const LEARN = [
  {
    from: 'Astryx · Action variants',
    take: 'Primary / Secondary / Ghost / Destructive — one vocabulary, every surface.',
    dostel: 'Ink primary, yellow accent tag, coral only on hover / focus.',
  },
  {
    from: 'Astryx · DateRangeInput',
    take: 'One trigger, human range text, popover calendar — never stacked native dates.',
    dostel: 'DateRangeField in the search dock; ISO under the hood.',
  },
  {
    from: 'Astryx · Selector',
    take: 'Listbox over OS select chrome; controlled value + onChange.',
    dostel: 'GuestSelect with explicit guest labels.',
  },
  {
    from: 'Astryx · Semantic tokens',
    take: 'Name by purpose (surface, text-primary, accent) — themes swap without rewrites.',
    dostel: '--color-surface / --color-text-primary / --color-accent in globals.css.',
  },
  {
    from: 'Meet your people',
    take: 'Social is the product, not a sidebar.',
    dostel: 'Who’s here this week — a board, not a chat casino.',
  },
  {
    from: 'Dense search control',
    take: 'Where / when / who must be one glance, one submit.',
    dostel: 'Paper search dock; ink submit; coral on hover only.',
  },
  {
    from: 'Property card hierarchy',
    take: 'Photo → trust → price → social, never the reverse.',
    dostel: 'Stamp + measured proof above the price tag.',
  },
]

const CORAL = [
  { step: '50', hex: '#FFDBD3' },
  { step: '100', hex: '#FFCBC2' },
  { step: '200', hex: '#FFB1A8' },
  { step: '300', hex: '#FF8D85' },
  { step: '400', hex: '#FF615E' },
  { step: '500', hex: '#F14A4A' },
  { step: '600', hex: '#D42A32', note: 'CTA · white 5.03:1' },
  { step: '700', hex: '#AD1120', note: 'Links · 7.18:1' },
  { step: '800', hex: '#860A16' },
  { step: '900', hex: '#60050D' },
  { step: '950', hex: '#3A0205' },
]

const YELLOW = [
  { step: '50', hex: '#FFF7B5', fillOnly: true },
  { step: '100', hex: '#FFF0A7', fillOnly: true },
  { step: '200', hex: '#FFE391', fillOnly: true },
  { step: '300', hex: '#F6D678', fillOnly: true },
  { step: '400', hex: '#EFCD65', fillOnly: true, note: 'Accent CTA fill' },
  { step: '500', hex: '#E7C34F', fillOnly: true },
  { step: '600', hex: '#CC9D00' },
  { step: '700', hex: '#A57700', note: 'Text-safe 4.01:1' },
  { step: '800', hex: '#835900' },
  { step: '900', hex: '#634200' },
  { step: 'logo', hex: '#FCCC00', fillOnly: true, note: 'Logo · fill only' },
]

const INK = [
  { step: '0', hex: '#FFFFFF' },
  { step: '50', hex: '#FEF8F8' },
  { step: '100', hex: '#F5F0EF' },
  { step: '200', hex: '#E6E0E0' },
  { step: '300', hex: '#D1CCCB' },
  { step: '400', hex: '#AEA9A9' },
  { step: '500', hex: '#908B8A' },
  { step: '600', hex: '#726D6D', note: 'Muted 5.01:1' },
  { step: '700', hex: '#555050', note: 'Body 7.93:1' },
  { step: '800', hex: '#383434' },
  { step: '900', hex: '#1F1B1B' },
  { step: '1000', hex: '#0B0B0C', note: 'Display' },
]

const PAIRS = [
  { use: 'Display / heading', fg: 'ink-1000', bg: 'paper', ratio: '19.36:1' },
  { use: 'Body text', fg: 'ink-900', bg: 'paper', ratio: '16.79:1' },
  { use: 'Muted text', fg: 'ink-600', bg: 'paper', ratio: '5.01:1' },
  { use: 'Link / brand text', fg: 'coral-700', bg: 'paper', ratio: '7.18:1' },
  { use: 'Primary CTA', fg: 'white', bg: 'coral-600', ratio: '5.03:1' },
  { use: 'Accent CTA', fg: 'ink-1000', bg: 'yellow-400', ratio: '12.73:1' },
  { use: 'Focus ring', fg: 'coral-600', bg: 'paper', ratio: '4.95:1' },
]

const NEVER = [
  'Coral / red as a hero wash or permanent flood — accent and focus only',
  'Native date stacks under a range label — use DateRangeField',
  'OS <select> chrome in marketing search — use GuestSelect / listbox',
  'Hardcoded hex in components — use semantic tokens (surface, accent, text-*)',
  'Yellow as the dominant surface — that is The Hosteller',
  'Points-as-currency, wallets, quest mechanics — that is Zostel',
  'Purple gradients, glassmorphism, dashboard-in-hero',
  'Cork textures, torn paper, fake tape — structural, not textural',
  'Emoji as UI icons',
  'Claiming verification we cannot timestamp',
  'Wrapping every row in a Card — dense data is rows and dividers',
  'Price-first property cards with social buried below the fold',
]

function copyText (value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value)
  }
  return Promise.reject(new Error('clipboard unavailable'))
}

function Swatch ({
  hex,
  label,
  note,
}: {
  hex: string
  label: string
  note?: string
}) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await copyText(hex)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* ignore */
    }
  }, [hex])

  return (
    <button
      type="button"
      onClick={onCopy}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:border-ink-400 hover:shadow-[0_12px_32px_rgba(11,11,12,0.08)] focus-visible:outline-none"
      aria-label={`Copy ${label} ${hex}`}
    >
      <span className="block h-20 w-full" style={{ background: hex }} aria-hidden />
      <span className="flex flex-1 flex-col gap-0.5 p-3">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-ink-1000">{label}</span>
          <span className="data text-[0.65rem] uppercase tracking-wider text-ink-400">
            {copied ? 'Copied' : 'Copy'}
          </span>
        </span>
        <span className="data text-xs text-ink-600">{hex}</span>
        {note && <span className="text-[0.7rem] text-ink-500">{note}</span>}
      </span>
    </button>
  )
}

function FieldsSpecimen () {
  const [range, setRange] = useState({ start: '2026-11-11', end: '2026-11-14' })
  const [guests, setGuests] = useState('2')
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <div className="overflow-visible rounded-sm border border-ink-200 bg-paper">
        <p className="data border-b border-ink-100 px-4 py-2 text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">
          DateRangeField · Astryx DateRangeInput
        </p>
        <DateRangeField value={range} onChange={setRange} />
      </div>
      <div className="overflow-visible rounded-sm border border-ink-200 bg-paper">
        <p className="data border-b border-ink-100 px-4 py-2 text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">
          GuestSelect · Astryx Selector
        </p>
        <GuestSelect value={guests} onChange={setGuests} />
      </div>
    </div>
  )
}

function SearchDates () {
  const [range, setRange] = useState({ start: '2026-11-11', end: '2026-11-14' })
  return <DateRangeField value={range} onChange={setRange} />
}

function SearchGuests () {
  const [guests, setGuests] = useState('2')
  return <GuestSelect value={guests} onChange={setGuests} />
}

function SectionNav ({ active }: { active: string }) {
  return (
    <nav
      aria-label="Design system sections"
      className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] w-44 shrink-0 overflow-y-auto lg:block"
    >
      <p className="data mb-3 text-[0.65rem] uppercase tracking-[0.18em] text-ink-400">
        Specimens
      </p>
      <ul className="space-y-1">
        {SECTIONS.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={[
                  'block rounded-lg px-3 py-2 text-sm transition-colors min-h-[40px]',
                  isActive
                    ? 'bg-ink-1000 font-semibold text-white'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-1000',
                ].join(' ')}
                aria-current={isActive ? 'location' : undefined}
              >
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function DesignSystemClient () {
  const [active, setActive] = useState('concept')

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.4, 0.7] }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-paper text-ink-700">
      <section className="relative overflow-hidden border-b border-ink-200">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 55% at 0% 0%, #FFDBD3 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, #FFE391 0%, transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tag">v2.2</span>
            <span className="stamp border-ink-400 text-ink-700">Noticeboard</span>
            <span className="stamp text-success border-success/40">
              <span className="board-pulse" aria-hidden />
              Live tokens
            </span>
            <span className="stamp text-info border-info/40">Astryx · remixed</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-ink-1000 sm:text-5xl lg:text-6xl">
            Dostel design system
          </h1>
          <p
            className="mt-3 text-xl text-ink-600 sm:text-2xl"
            style={{ fontFamily: 'var(--font-deva)' }}
          >
            दोस्त + hostel
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Noticeboard DNA, Astryx discipline. Semantic tokens, Action variants,
            Field popovers — studied from Meta&apos;s open design system and Hostelworld
            patterns, rewritten so coral is an accent, yellow is a tag, and proof beats claims.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Image
              src="/logo.png"
              alt="Dostel logo stamp"
              width={72}
              height={72}
              className="rounded-sm shadow-md"
            />
            <p className="max-w-sm text-sm text-ink-500">
              Palette extracted from the mark. Specimens below are the same CSS
              variables shipping on guest + admin.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <SectionNav active={active} />

        <div className="min-w-0 flex-1 space-y-20">
          <section id="concept" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              01 · Concept
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">The Noticeboard</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Real hostels speak in stamps, tags, boards, and guestbooks — not hotel card grids.
              We take that structural logic and execute it flat, modern, high-craft.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Stamp', body: 'Proof something was checked — badges, verified cards, the logo.' },
                { title: 'Tag', body: 'A label tied to a thing. Yellow lives here — high attention, low area.' },
                { title: 'Board', body: "What's happening, who's around. Cards pin ≤1.5° on entry." },
                { title: 'Guestbook', body: 'Handwriting from people who came before — reviews, stay memories.' },
              ].map((item, i) => (
                <article
                  key={item.title}
                  className="board-card rounded-xl border border-ink-200 bg-white p-5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <h3 className="text-lg font-bold text-ink-1000">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-ink-200 bg-ink-1000 p-6 text-white sm:p-8">
              <p className="data text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Counter-position</p>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-white/50">Zostel</p>
                  <p className="mt-1 font-semibold">Casino loyalty</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">The Hosteller</p>
                  <p className="mt-1 font-semibold">Yellow on black</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-logo">Dostel</p>
                  <p className="mt-1 font-semibold text-coral-300">Being known, not scored</p>
                </div>
              </div>
            </div>
          </section>

          <section id="learn" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              01b · Learn
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Hostelworld patterns, Dostel DNA</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Hostelworld wins on social clarity and booking density. We steal the
              <em className="not-italic font-semibold text-ink-800"> job</em> of each
              pattern — never the chrome. Coral stamp + board logic stays ours.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {LEARN.map((row, i) => (
                <article
                  key={row.from}
                  className="board-card rounded-xl border border-ink-200 bg-white p-5"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <p className="data text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">
                    HW · {row.from}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink-800">{row.take}</p>
                  <p className="mt-3 border-l-2 border-coral-500 pl-3 text-sm leading-relaxed text-ink-600">
                    <span className="font-semibold text-coral-700">Dostel · </span>
                    {row.dostel}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="colour" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              02 · Colour
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Coral leads</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Rule 1: coral ≥ 3× yellow by area. Rule 2: logo hues are graphic colours —
              <code className="mx-1 rounded bg-ink-100 px-1 data text-xs">#F54E4E</code>
              fails body text; yellow-logo is fill only.
            </p>

            <h3 className="mt-10 text-lg font-bold text-ink-1000">Coral</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {CORAL.map((c) => (
                <Swatch key={c.step} hex={c.hex} label={`coral-${c.step}`} note={c.note} />
              ))}
            </div>

            <h3 className="mt-10 text-lg font-bold text-ink-1000">Yellow · the tag</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {YELLOW.map((c) => (
                <Swatch
                  key={c.step}
                  hex={c.hex}
                  label={`yellow-${c.step}`}
                  note={c.fillOnly ? `${c.note || 'Fill only'} · ink on top` : c.note}
                />
              ))}
            </div>

            <h3 className="mt-10 text-lg font-bold text-ink-1000">Ink · neutrals with coral hue</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {INK.map((c) => (
                <Swatch key={c.step} hex={c.hex} label={`ink-${c.step}`} note={c.note} />
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Swatch hex="#FFFDF9" label="paper" note="Warm ground · never clinical white" />
              <div className="grid grid-cols-2 gap-3">
                <Swatch hex="#A02B18" label="error" note="Icon + label required" />
                <Swatch hex="#0F7A4A" label="success" />
                <Swatch hex="#835900" label="warning" />
                <Swatch hex="#1F5FA8" label="info" />
              </div>
            </div>

            <h3 className="mt-10 text-lg font-bold text-ink-1000">Verified pairs · WCAG 2.1</h3>
            <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200 bg-white">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50 data text-[0.65rem] uppercase tracking-[0.14em] text-ink-500">
                    <th className="px-4 py-3 font-medium">Use</th>
                    <th className="px-4 py-3 font-medium">Foreground</th>
                    <th className="px-4 py-3 font-medium">Background</th>
                    <th className="px-4 py-3 font-medium">Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {PAIRS.map((p) => (
                    <tr key={p.use} className="border-t border-ink-100">
                      <td className="px-4 py-3 font-medium text-ink-900">{p.use}</td>
                      <td className="px-4 py-3 data text-ink-600">{p.fg}</td>
                      <td className="px-4 py-3 data text-ink-600">{p.bg}</td>
                      <td className="px-4 py-3 data font-semibold text-success">{p.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="type" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              03 · Typography
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Printed, not rendered</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Bricolage carries the brand. Inter stays for UI legibility on low-end Android.
              JetBrains Mono is reserved for proof — never decoration.
            </p>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
                <p className="data text-[0.65rem] uppercase tracking-[0.18em] text-ink-400">Display · Bricolage Grotesque</p>
                <p className="mt-4 text-4xl font-bold tracking-tight text-ink-1000 sm:text-5xl lg:text-6xl">
                  Arrive a stranger.
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink-800">Leave a Dosteller.</p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
                <p className="data text-[0.65rem] uppercase tracking-[0.18em] text-ink-400">Body · Inter</p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">
                  The staff remember your name. Wi-Fi is measured, not claimed. You can see
                  who&apos;s in the room before you book — because being known beats being scored.
                </p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
                <p className="data text-[0.65rem] uppercase tracking-[0.18em] text-ink-400">Data · JetBrains Mono</p>
                <p className="mt-4 data text-lg text-ink-900">
                  DST-4821 · 48 Mbps · 14:20 IST · VERIFIED
                </p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
                <p className="data text-[0.65rem] uppercase tracking-[0.18em] text-ink-400">Devanagari · Noto Sans</p>
                <p className="mt-4 text-3xl text-ink-1000" style={{ fontFamily: 'var(--font-deva)' }}>
                  दोस्त · دوست · dost
                </p>
              </div>
            </div>
          </section>

          <section id="space" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              03b · Space & elevation
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Rhythm before decoration</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Hostelworld feels dense but scannable because spacing is intentional.
              We keep warm paper breathing room — never hotel-card clutter, never sparse luxury void.
            </p>
            <div className="mt-8 overflow-x-auto rounded-xl border border-ink-200 bg-white">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50 data text-[0.65rem] uppercase tracking-[0.14em] text-ink-500">
                    <th className="px-4 py-3 font-medium">Token</th>
                    <th className="px-4 py-3 font-medium">px</th>
                    <th className="px-4 py-3 font-medium">Use</th>
                    <th className="px-4 py-3 font-medium">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {SPACING.map((s) => (
                    <tr key={s.token} className="border-t border-ink-100">
                      <td className="px-4 py-3 data font-semibold text-ink-900">space-{s.token}</td>
                      <td className="px-4 py-3 data text-ink-600">{s.px}</td>
                      <td className="px-4 py-3 text-ink-700">{s.use}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block h-3 rounded-sm bg-coral-500"
                          style={{ width: `${Number(s.px) * 1.2}px` }}
                          aria-hidden
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ELEVATION.map((e) => (
                <div
                  key={e.name}
                  className="rounded-xl border border-ink-200 bg-white p-5"
                  style={{ boxShadow: e.shadow === 'none' ? undefined : e.shadow }}
                >
                  <p className="data text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">{e.name}</p>
                  <p className="mt-2 text-sm font-semibold text-ink-900">{e.use}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="primitives" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              04 · Primitives
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Stamp · Tag · Board</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              CSS classes ship in <code className="rounded bg-ink-100 px-1 data text-xs">globals.css</code>.
              Use them; don&apos;t reinvent.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-ink-200 bg-white p-6">
                <h3 className="font-bold text-ink-1000">Stamp</h3>
                <p className="mt-1 text-sm text-ink-500">Proof · mono · uppercase</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="stamp text-coral-700 border-coral-400">Verified</span>
                  <span className="stamp text-success border-success/40">
                    <span className="board-pulse" aria-hidden />
                    Live
                  </span>
                  <span className="stamp text-info border-info/40">Measured</span>
                  <span className="stamp text-warning border-warning/40">Hold</span>
                  <span className="stamp text-error border-error/40">Error</span>
                </div>
              </div>
              <div className="rounded-xl border border-ink-200 bg-white p-6">
                <h3 className="font-bold text-ink-1000">Tag</h3>
                <p className="mt-1 text-sm text-ink-500">Yellow fill · ink type · clipped edge</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="tag">₹899 / night</span>
                  <span className="tag">6-bed dorm</span>
                  <span className="tag">Free cancel</span>
                  <span className="tag">Ops</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="board-card rounded-xl border border-ink-200 bg-white p-5 shadow-sm"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="tag">Pinned</span>
                  <p className="mt-3 font-bold text-ink-1000">Board card {i + 1}</p>
                  <p className="mt-1 text-sm text-ink-500">
                    Settles ≤1.5° once on entry — never on hover.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="action" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-ink-500">
              04b · Action
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">One vocabulary</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              From Astryx Action: Primary, Secondary, Ghost, Destructive — plus Dostel Accent (yellow tag).
              Ink carries the primary; coral appears on hover and focus, not as a permanent wash.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-ink-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-ink-1000">Button</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              <div className="rounded-sm border border-ink-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-ink-1000">Accent · sizes</h3>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button variant="accent" size="sm">Accent sm</Button>
                  <Button variant="accent" size="md">Accent md</Button>
                  <Button variant="primary" size="lg">Primary lg</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </section>

          <section id="fields" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-ink-500">
              04c · Fields
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Controlled inputs</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Astryx Field rule: value + onChange, human trigger text, popover for complex picks.
              Live specimens below power the guest search dock.
            </p>
            <FieldsSpecimen />
          </section>

          <section id="search" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-ink-500">
              04d · Search
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">One strip. One submit.</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              From Hostelworld: destination, dates, travellers must read as a single control.
              From Astryx: DateRange + Selector — not stacked native chrome.
            </p>
            <div className="mt-8 overflow-visible rounded-sm border border-ink-200 bg-paper shadow-[0_18px_40px_-24px_rgba(11,11,12,0.5)]">
              <form
                className="flex flex-col sm:flex-row sm:items-stretch"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="min-w-0 flex-[1.4] border-b border-ink-100 sm:border-b-0 sm:border-r">
                  <DestinationField
                    value="Kodaikanal"
                    onChange={() => {}}
                    options={[
                      { label: 'Kodaikanal · Dostel Vattakanal', slug: 'dostel-vattakanal', city: 'Kodaikanal' },
                      { label: 'Anjuna · Dostel Anjuna', slug: 'dostel-goa-beach', city: 'Anjuna' },
                      { label: 'Coorg · Dostel Coorg', slug: 'dostel-coorg-rainforest', city: 'Coorg' },
                    ]}
                    placeholder="Where do you want to go?"
                  />
                </div>
                <div className="min-w-0 flex-[1.15] border-b border-ink-100 sm:border-b-0 sm:border-r">
                  <SearchDates />
                </div>
                <div className="min-w-0 sm:w-40">
                  <SearchGuests />
                </div>
                <div className="flex items-center p-2">
                  <Button type="submit" className="w-full sm:h-14 sm:w-14 sm:px-0" aria-label="Search hostels">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="sm:hidden">Find beds</span>
                  </Button>
                </div>
              </form>
              <div className="flex flex-wrap gap-2 border-t border-ink-100 px-4 py-3">
                <span className="tag">Free cancel</span>
                <span className="tag">Dorms + private</span>
                <span className="stamp border-ink-400 text-ink-700">Verified stays only</span>
              </div>
            </div>
          </section>

          <section id="property" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-ink-500">
              05 · Property card
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Trust before price</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Photo → verified stamp → measured proof → who’s arriving → price tag.
              Price never leads. Social never hides.
            </p>
            <article className="property-card mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-[0_8px_24px_-12px_rgba(11,11,12,0.25)]">
              <div className="grid md:grid-cols-[1.15fr_1fr]">
                <div className="relative min-h-[220px] bg-gradient-to-br from-coral-200 via-paper to-yellow-200">
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #FF615E55, transparent 55%)' }} aria-hidden />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="stamp border-white/50 bg-white/90 text-coral-700">Verified</span>
                    <span className="tag">Mountains</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="data text-[0.65rem] uppercase tracking-[0.16em] text-ink-700/70">Photo · full-bleed, never inset</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="stamp text-success border-success/40">9.2 · Loved</span>
                      <span className="data text-xs text-ink-500">128 guest notes</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink-1000">Dostel Vattakanal</h3>
                    <p className="mt-1 text-sm text-ink-600">Kodaikanal hills · 12 min walk from junction</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="stamp text-info border-info/40">Wi-Fi 48 Mbps · 14:20</span>
                      <span className="stamp text-coral-700 border-coral-400">Power backup</span>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="avatar-stack" aria-label="Guests arriving this week">
                        {['A', 'R', 'M', 'S'].map((ch) => (
                          <span key={ch} className="avatar-chip">{ch}</span>
                        ))}
                      </div>
                      <p className="text-sm text-ink-600">
                        <span className="font-semibold text-ink-900">6 Dostellers</span> checking in Fri–Sun
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-ink-100 pt-4">
                    <div>
                      <p className="data text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">From</p>
                      <p className="tag mt-1">₹899 / night</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-coral-600 px-5 text-sm font-semibold text-white transition hover:bg-coral-700"
                    >
                      See beds
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section id="social" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              04d · Social & guestbook
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">See who’s going</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Hostelworld’s edge is pre-arrival connection. Ours is being known —
              named people, stay windows, no points wallet.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-ink-200 bg-ink-1000 p-5 text-white sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="board-pulse" aria-hidden />
                  <span className="data text-[0.65rem] uppercase tracking-[0.16em] text-white/50">Who’s here · this week</span>
                </div>
                <ul className="space-y-3">
                  {[
                    { name: 'Ananya', when: 'Fri–Mon · dorm 6', note: 'Looking for a sunrise hike' },
                    { name: 'Rohit', when: 'Sat–Tue · private', note: 'Remote week · quiet desk' },
                    { name: 'Maya', when: 'Sun–Wed · dorm 8', note: 'First Dosteller stay' },
                  ].map((g) => (
                    <li key={g.name} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <span className="avatar-chip avatar-chip--dark" aria-hidden>{g.name[0]}</span>
                      <span>
                        <span className="block font-semibold">{g.name}</span>
                        <span className="data block text-[0.7rem] text-white/45">{g.when}</span>
                        <span className="mt-1 block text-sm text-white/70">{g.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {[
                  { who: 'Levin', quote: 'Nice to meet people — it connects the whole house.', stay: 'Vattakanal · Mar 2026' },
                  { who: 'Sam', quote: 'I could see who was in the room before I booked. That mattered.', stay: 'Anjuna · Jan 2026' },
                  { who: 'Sara', quote: 'Solo travel felt less solo by the first chai.', stay: 'Dharamshala · Feb 2026' },
                ].map((r) => (
                  <blockquote key={r.who} className="guestbook-card rounded-xl border border-ink-200 bg-white p-5">
                    <p className="text-ink-800 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                    <footer className="mt-3 flex items-center justify-between gap-3">
                      <span className="font-semibold text-ink-900">{r.who}</span>
                      <span className="data text-[0.7rem] text-ink-500">{r.stay}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>

          <section id="components" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-ink-500">
              07 · Components
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Interface kit</h2>
            <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
              Prefer <code className="rounded bg-ink-100 px-1 data text-xs">components/ui/*</code> before raw HTML.
              Touch targets ≥44px. Focus ring uses <code className="rounded bg-ink-100 px-1 data text-xs">--color-accent</code>.
            </p>

            <div className="mt-8 space-y-8">
              <div className="rounded-sm border border-ink-200 bg-white p-6">
                <h3 className="font-bold text-ink-1000">Buttons · ui/Button</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="primary">Book stay</Button>
                  <Button variant="accent">Accent action</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </div>
              </div>

              <div className="rounded-sm border border-ink-200 bg-white p-6">
                <h3 className="font-bold text-ink-1000">Semantic tokens</h3>
                <p className="mt-1 text-sm text-ink-500">Purpose names — Astryx rule 5. Swap theme without rewriting components.</p>
                <ul className="mt-4 grid gap-2 data text-xs sm:grid-cols-2">
                  {[
                    ['--color-surface', 'paper ground'],
                    ['--color-text-primary', 'ink-1000'],
                    ['--color-accent', 'coral-600 focus / hover'],
                    ['--color-tag-fill', 'yellow-300'],
                    ['--color-negative', 'error · with icon'],
                    ['--radius-control', '4px fields'],
                  ].map(([token, note]) => (
                    <li key={token} className="flex justify-between gap-3 border border-ink-100 px-3 py-2">
                      <code className="text-ink-800">{token}</code>
                      <span className="text-ink-500">{note}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-start gap-2 text-sm text-error" role="alert">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16h.01" />
                  </svg>
                  Error must include an icon — coral alone is not destructive.
                </p>
              </div>

              <div className="rounded-xl border border-ink-200 bg-white p-6">
                <h3 className="font-bold text-ink-1000">Loyalty tiers · Dostellers</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[
                    { name: 'Bronze', color: 'var(--color-bronze)' },
                    { name: 'Silver', color: 'var(--color-silver)' },
                    { name: 'Gold', color: 'var(--color-gold)' },
                  ].map((t) => (
                    <span
                      key={t.name}
                      className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold"
                      style={{ borderColor: t.color, color: t.color, background: `color-mix(in srgb, ${t.color} 12%, white)` }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Metallics are accents at ~10% fill — never casino gold surfaces.
                </p>
              </div>

              <div className="board-frame p-5 text-white">
                <div className="mb-3 flex items-center gap-2">
                  <span className="board-pulse" aria-hidden />
                  <span className="data text-[0.65rem] uppercase tracking-[0.16em] text-white/50">
                    Departure board frame
                  </span>
                </div>
                <p className="font-bold tracking-tight">Split-flap is the only elaborate motion.</p>
                <p className="mt-1 text-sm text-white/55">
                  Reserved for landing signature — nothing else gets this budget.
                </p>
                <div className="mt-4 flex gap-1" aria-hidden>
                  {['D', 'O', 'S', 'T', 'E', 'L'].map((ch) => (
                    <span key={ch} className="flap flap-live" style={{ width: '2rem', height: '2.5rem', fontSize: '0.875rem' }}>
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="motion" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              06 · Motion
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Purpose, not decoration</h2>
            <ul className="mt-6 space-y-3">
              {[
                { name: 'Card lift', detail: 'translateY(-2px) — interactivity' },
                { name: 'Page fade', detail: 'opacity 0→1 — continuity' },
                { name: 'Press', detail: 'scale(0.97) — tactile feedback' },
                { name: 'Pin', detail: '≤1.5° settle on board entry, once' },
                { name: 'Reveal', detail: '18px rise on scroll, once per element' },
                { name: 'Split-flap', detail: 'Landing only — the animation is the content' },
              ].map((m) => (
                <li
                  key={m.name}
                  className="flex flex-col gap-1 rounded-xl border border-ink-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-ink-1000">{m.name}</span>
                  <span className="data text-sm text-ink-500">{m.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-500">
              All respect <code className="rounded bg-ink-100 px-1 data text-xs">prefers-reduced-motion</code>.
            </p>
          </section>

          <section id="voice" className="scroll-mt-24">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              07 · Voice
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Proof in the copy</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-success/30 bg-white p-6">
                <p className="stamp text-success border-success/40 mb-3">Say</p>
                <p className="text-ink-800 leading-relaxed">
                  &ldquo;Wi-Fi measured 48 Mbps at the common room, 14:20 today.&rdquo;
                </p>
                <p className="mt-4 text-ink-800 leading-relaxed">
                  &ldquo;Ravi will meet you at the junction.&rdquo;
                </p>
              </div>
              <div className="rounded-xl border border-error/30 bg-white p-6">
                <p className="stamp text-error border-error/40 mb-3">Not</p>
                <p className="text-ink-800 leading-relaxed">
                  &ldquo;Blazing-fast connectivity!&rdquo;
                </p>
                <p className="mt-4 text-ink-800 leading-relaxed">
                  &ldquo;Seamless arrival experience.&rdquo;
                </p>
              </div>
            </div>
          </section>

          <section id="never" className="scroll-mt-24 pb-8">
            <p className="data mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-coral-700">
              08 · Never
            </p>
            <h2 className="text-3xl font-bold text-ink-1000 sm:text-4xl">Hard rules</h2>
            <ul className="mt-6 space-y-3">
              {NEVER.map((rule) => (
                <li
                  key={rule}
                  className="flex gap-3 rounded-xl border border-ink-200 bg-white px-5 py-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-50 text-coral-700" aria-hidden>
                    ×
                  </span>
                  <span className="text-ink-800">{rule}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-ink-200 bg-ink-1000 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="data text-[0.65rem] uppercase tracking-[0.18em] text-white/40">Source of truth</p>
                <p className="mt-2 text-lg font-bold">Noticeboard v2.2 · globals.css</p>
                <p className="mt-1 text-sm text-white/50">
                  Tokens regenerate via <span className="data">.paperclip/design/system/palette.py</span>
                </p>
              </div>
              <Link
                href="/hostels"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-coral-600 px-5 text-sm font-semibold text-white transition hover:bg-coral-700"
              >
                See it on product
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
