import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import SplitFlapBoard from '@/components/SplitFlapBoard'
import Reveal from '@/components/Reveal'
import CircuitMap from '@/components/CircuitMap'
import LandingHero from '@/components/LandingHero'
import { getLandingPage } from '@/lib/landing'
import { HERO_VIDEO_CLIPS } from '@/lib/hero-videos'

/**
 * Guest homepage — fully driven by landingPage GraphQL (admin CMS + live hostels).
 * No static board/strip/thesis/traveller copy. SearchBar destinations from live hostels.
 * User: "make it dynamic and controlled via the admin panel… no static data."
 */

export const revalidate = 30

export default async function HomePage () {
  const landing = await getLandingPage()

  if (!landing) {
    return (
      <div className="bg-paper px-4 py-24 text-center">
        <h1 className="text-3xl text-ink-1000">Dostel</h1>
        <p className="mt-3 text-ink-600">The board is catching up. Try again in a moment.</p>
        <Link href="/hostels" className="mt-6 inline-flex text-coral-700 underline">
          Browse hostels
        </Link>
      </div>
    )
  }

  if (landing.isPublished === false) {
    return (
      <div className="bg-paper px-4 py-24 text-center">
        <h1 className="text-3xl text-ink-1000">Dostel</h1>
        <p className="mt-3 text-ink-600">We are refreshing the board. Hostels are still bookable.</p>
        <Link href="/hostels" className="mt-6 inline-flex text-coral-700 underline">
          Browse hostels
        </Link>
      </div>
    )
  }

  const boardRows = landing.boardRows.map((r) => ({
    what: r.what,
    where: r.where,
    when: r.when,
    status: r.status,
    live: r.live,
  }))

  const stripPhotos = landing.stripPhotos
  const stripFacts = landing.stripFacts
  const stripPairs = Math.max(stripPhotos.length, stripFacts.length, 1)
  const heroPhoto =
    stripPhotos[0] ||
    landing.hostelNodes.find((n) => n.coverImageUrl) ||
    null
  const heroImageUrl =
    (heroPhoto && 'url' in heroPhoto ? heroPhoto.url : null) ||
    (heroPhoto && 'coverImageUrl' in heroPhoto ? heroPhoto.coverImageUrl : null) ||
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80'
  const heroImageAlt =
    (heroPhoto && 'alt' in heroPhoto && heroPhoto.alt) ||
    (heroPhoto && 'name' in heroPhoto ? heroPhoto.name : null) ||
    'Dostel hostel'

  return (
    <div className="bg-paper">
      <LandingHero
        stamp={landing.heroStamp}
        title={landing.heroTitle}
        subtitle={landing.heroSubtitle}
        imageUrl={heroImageUrl}
        imageAlt={heroImageAlt || undefined}
        videos={HERO_VIDEO_CLIPS}
      >
        <SearchBar
          variant="hero"
          placeholder={landing.searchPlaceholder}
          destinations={landing.destinations.map((d) => ({ label: d.label, slug: d.slug, city: d.city }))}
        />
      </LandingHero>

      <section className="border-t border-ink-100 bg-paper pb-12 pt-16 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={80} className="min-w-0">
            <SplitFlapBoard
              rows={boardRows}
              title={landing.boardTitle}
              columns={((): [string, string, string, string] => {
                const cols = [...(landing.boardColumns || [])]
                while (cols.length < 4) cols.push(['Where', 'Known for', 'From', 'Tonight'][cols.length])
                return cols.slice(0, 4) as [string, string, string, string]
              })()}
              caption={landing.boardCaption}
            />
          </Reveal>
        </div>
      </section>

      {(stripPhotos.length > 0 || stripFacts.length > 0) && (
        <section className="overflow-hidden border-y border-ink-200 bg-ink-1000 py-3" aria-label="The Dostel network at a glance">
          <div className="animate-marquee-slow gap-3">
            {[0, 1, 2].map((pass) =>
              Array.from({ length: stripPairs }).map((_, i) => (
                <div key={`${pass}-${i}`} className="flex shrink-0 gap-3">
                  {stripPhotos[i % Math.max(stripPhotos.length, 1)] && (
                    <div
                      className="h-40 w-64 shrink-0 rounded-sm bg-ink-900 bg-cover bg-center transition-transform duration-500 ease-out hover:scale-[1.03] sm:h-52 sm:w-80"
                      style={{
                        backgroundImage: `url(${stripPhotos[i % stripPhotos.length].url})`,
                      }}
                      role="presentation"
                    />
                  )}
                  {stripFacts[i % Math.max(stripFacts.length, 1)] && (
                    <div className="flex h-40 w-56 shrink-0 flex-col justify-end rounded-sm border border-white/12 p-5 sm:h-52 sm:w-64">
                      <span className="text-2xl leading-tight text-white sm:text-3xl">
                        {stripFacts[i % stripFacts.length].label}
                      </span>
                      <span className="mt-1.5 text-sm leading-6 text-white/55">
                        {stripFacts[i % stripFacts.length].detail}
                      </span>
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <h2 className="max-w-3xl text-[2.25rem] leading-[1.06] tracking-[-0.03em] text-ink-1000 sm:text-5xl">
            {landing.thesisTitle}
            <span className="mt-2 block text-ink-800">{landing.thesisHighlight}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {landing.thesisCards.map((item, i) => (
            <Reveal key={item.head} delay={i * 110}>
              <div className="flex h-full flex-col">
                <h3 className="text-xl text-ink-1000">{item.head}</h3>
                <p className="mt-3 flex-1 leading-7 text-ink-700">{item.body}</p>
                <Link
                  href={item.href}
                  className="link-nudge mt-5 inline-flex w-fit items-center gap-1.5 border-b-2 border-ink-1000 pb-0.5 text-sm font-semibold text-ink-1000 transition-[gap,color,border-color] duration-200 hover:gap-2.5 hover:border-coral-600 hover:text-coral-700"
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

      <section className="border-t border-ink-200 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="stamp border-ink-400 text-ink-700">{landing.whosGoingStamp}</span>
                <h2 className="mt-4 text-[2.25rem] leading-[1.06] tracking-[-0.03em] text-ink-1000 sm:text-5xl">
                  {landing.whosGoingTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-ink-700">{landing.whosGoingBody}</p>
              </div>
              <Link
                href={landing.whosGoingBrowseHref}
                className="text-sm font-semibold text-coral-700 underline-offset-4 hover:underline"
              >
                {landing.whosGoingBrowseLabel}
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Reveal delay={80}>
              <div className="rounded-sm border border-ink-200 bg-ink-1000 p-5 text-white sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="board-pulse" aria-hidden />
                  <span className="data text-[0.65rem] uppercase tracking-[0.16em] text-white/50">
                    {landing.whosGoingPanelTitle}
                  </span>
                </div>
                {landing.travellers.length === 0 ? (
                  <p className="text-sm leading-7 text-white/60">{landing.whosGoingEmptyMessage}</p>
                ) : (
                  <ul className="space-y-3">
                    {landing.travellers.map((g) => (
                      <li key={`${g.name}-${g.where}-${g.when}`} className="flex items-start gap-3 rounded-sm border border-white/10 bg-white/5 p-3 transition-colors duration-150 hover:border-white/25 hover:bg-white/10">
                        <span className="avatar-chip avatar-chip--dark" aria-hidden>{g.initial}</span>
                        <span>
                          <span className="block font-semibold">{g.name}</span>
                          <span className="data block text-[0.7rem] text-white/45">
                            {g.where} · {g.when}
                          </span>
                          {g.note && <span className="mt-1 block text-sm text-white/70">{g.note}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex h-full flex-col justify-between rounded-sm border border-ink-200 bg-white p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="avatar-stack" aria-label="Travellers across the network">
                      {(landing.travellers.length
                        ? landing.travellers.slice(0, 5).map((t) => t.initial)
                        : landing.hostelNodes.slice(0, 5).map((h) => (h.city || h.name || '?')[0].toUpperCase())
                      ).map((ch, i) => (
                        <span key={`${ch}-${i}`} className="avatar-chip">{ch}</span>
                      ))}
                    </div>
                    <p className="text-sm text-ink-600">
                      <span className="font-semibold text-ink-900">{landing.travellersThisWeek} travellers</span>{' '}
                      checking in across the network this week
                    </p>
                  </div>
                  <h3 className="mt-8 text-xl text-ink-1000">{landing.whosGoingSideTitle}</h3>
                  <p className="mt-3 leading-7 text-ink-700">{landing.whosGoingSideBody}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {landing.whosGoingTags.map((tag) =>
                    tag.toLowerCase().includes('cleared') ? (
                      <span key={tag} className="stamp border-success/40 text-success">{tag}</span>
                    ) : (
                      <span key={tag} className="tag">{tag}</span>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-200 bg-ink-1000 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="stamp text-yellow-300">{landing.circuitsStamp}</span>
                <h2 className="mt-4 whitespace-pre-line text-[2.25rem] leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl">
                  {landing.circuitsTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/70">{landing.circuitsBody}</p>
              </div>
              <Link href="/hostels" className="text-sm font-semibold text-yellow-300 underline-offset-4 hover:underline">
                Or browse all {landing.networkCount}
              </Link>
            </div>
          </Reveal>

          <div className="mt-12">
            <CircuitMap circuits={landing.circuits} hostelNodes={landing.hostelNodes} />
          </div>
        </div>
      </section>

      <section className="bg-ink-1000 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-[2.5rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl">
              {landing.closeTitle.includes('दोस्त') ? (
                <>
                  {landing.closeTitle.split('दोस्त')[0]}
                  <span className="text-yellow-logo" style={{ fontFamily: 'var(--font-deva)' }}>दोस्त</span>
                  {landing.closeTitle.split('दोस्त')[1] || ''}
                </>
              ) : (
                landing.closeTitle
              )}
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-6 max-w-xl leading-8 text-white/70">{landing.closeBody}</p>
          </Reveal>
          <Reveal delay={170}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={landing.closePrimaryHref}
                className="btn-press inline-flex h-12 items-center justify-center rounded-sm bg-white px-7 text-sm font-semibold text-ink-1000 transition-colors duration-150 hover:bg-yellow-logo"
              >
                {landing.closePrimaryCta}
              </Link>
              <Link
                href={landing.closeSecondaryHref}
                className="btn-press inline-flex h-12 items-center justify-center rounded-sm border border-white/25 px-7 text-sm font-semibold text-white transition-colors duration-150 hover:border-white/50 hover:bg-white/8"
              >
                {landing.closeSecondaryCta}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
