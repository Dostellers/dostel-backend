import Link from 'next/link'
import Image from 'next/image'
import SocialProof from './SocialProof'
import { TrendingIcon } from './Icons'

interface HostelCardProps {
  slug: string
  name: string
  location: string
  tagline: string
  price: number
  rating: number
  reviewCount: number
  image: string
  tags: string[]
  isNew?: boolean
  isTrending?: boolean
  soldOut?: boolean
  bookedThisWeek?: number
  dostellerPrice?: number
  variant?: 'grid' | 'list'
  categoryLabel?: string
  proofMeasured?: number
  proofTotal?: number
}

const AVATAR_POOL = ['A', 'R', 'M', 'S', 'K', 'N', 'P', 'T']

export default function HostelCard ({
  slug,
  name,
  location,
  tagline,
  price,
  rating,
  reviewCount,
  image,
  tags,
  isNew,
  isTrending,
  soldOut,
  bookedThisWeek,
  dostellerPrice,
  variant = 'grid',
  categoryLabel,
  proofMeasured,
  proofTotal,
}: HostelCardProps) {
  const arriving = bookedThisWeek || (isTrending ? 6 : isNew ? 3 : 0)
  const chips = AVATAR_POOL.slice(0, Math.min(4, Math.max(2, arriving)))

  if (variant === 'list') {
    if (soldOut) {
      return (
        <div
          className="property-card flex gap-4 rounded-sm border border-ink-200 bg-white p-3 opacity-60"
          aria-disabled="true"
        >
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm sm:h-32 sm:w-32">
            <Image src={image} alt="" fill className="object-cover" sizes="128px" />
            <div className="absolute inset-0 flex items-center justify-center bg-ink-1000/45">
              <span className="stamp border-white/40 bg-white/95 text-ink-700">Sold out</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <h3 className="truncate text-sm font-semibold text-ink-1000">{name}</h3>
            <p className="mt-0.5 text-xs text-ink-500">{location}</p>
          </div>
        </div>
      )
    }

    return (
      <Link
        href={`/hostels/${slug}`}
        className="property-card group flex gap-4 rounded-sm border border-ink-200 bg-white p-3"
      >
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm sm:h-32 sm:w-32">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="128px"
          />
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-1000/45">
              <span className="stamp border-white/40 bg-white/95 text-ink-700">Sold out</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-semibold text-ink-1000">{name}</h3>
              <span className="stamp shrink-0 border-success/40 text-success">
                {rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-ink-500">{location}</p>
            <p className="mt-1 line-clamp-1 text-xs text-ink-600">{tagline}</p>
          </div>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <span className="tag">₹{price} / night</span>
              {dostellerPrice ? (
                <p className="mt-1 text-xs font-medium text-coral-700">Dosteller ₹{dostellerPrice}</p>
              ) : null}
            </div>
            <div className="flex gap-1">
              {isNew ? <span className="stamp border-coral-400 text-coral-700">New</span> : null}
              {isTrending ? (
                <span className="stamp inline-flex items-center gap-1 border-coral-400 text-coral-700">
                  <TrendingIcon className="h-3 w-3" />
                  Filling
                </span>
              ) : null}
            </div>
          </div>
          {arriving > 0 ? <SocialProof bookedThisWeek={arriving} variant="card" /> : null}
        </div>
      </Link>
    )
  }

  if (soldOut) {
    return (
      <div className="property-card flex h-full flex-col opacity-60" aria-disabled="true">
        <article className="flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
            <div className="absolute left-0 top-4">
              <span className="bg-ink-700 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                Sold out
              </span>
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-lg leading-tight text-ink-1000">{name}</h2>
            <p className="mt-1 text-sm text-ink-600">{location}</p>
          </div>
        </article>
      </div>
    )
  }

  return (
    <Link
      href={`/hostels/${slug}`}
      className="property-card group flex h-full flex-col"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-1000/55 via-transparent to-transparent" />

          <div className="absolute left-0 top-4 flex flex-col gap-1.5">
            {isTrending ? (
              <span className="bg-coral-600 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                Filling fast
              </span>
            ) : null}
            {isNew && !isTrending ? (
              <span className="bg-ink-1000 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                Just opened
              </span>
            ) : null}
            {soldOut ? (
              <span className="bg-ink-700 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                Sold out
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="stamp border-white/50 bg-white/95 text-coral-700">Verified</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="data text-[0.625rem] uppercase tracking-[0.18em] text-ink-500">
              {categoryLabel || tags[0] || 'Hostel'}
            </span>
            <span className="stamp shrink-0 border-success/40 text-success">
              {rating.toFixed(1)} · {reviewCount.toLocaleString('en-IN')}
            </span>
          </div>

          <h2 className="mt-2 text-lg leading-tight text-ink-1000">{name}</h2>
          <p className="mt-1 text-sm text-ink-600">{location}</p>
          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-ink-700">{tagline}</p>

          {typeof proofMeasured === 'number' && typeof proofTotal === 'number' ? (
            <p className="data mt-3 flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-600">
              <svg className="h-3 w-3 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m4 12.5 5 5L20 6.5" />
              </svg>
              Stay card · {proofMeasured} of {proofTotal} checks measured
            </p>
          ) : null}

          {arriving > 0 ? (
            <div className="mt-3 flex items-center gap-2.5">
              <div className="avatar-stack" aria-hidden>
                {chips.map((ch) => (
                  <span key={ch} className="avatar-chip">{ch}</span>
                ))}
              </div>
              <p className="text-xs text-ink-600">
                <span className="font-semibold text-ink-900">{arriving} travellers</span>
                {' '}this week
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex items-end justify-between gap-2 border-t border-ink-200 pt-4">
            <div>
              <p className="data text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">From</p>
              <p className="mt-0.5">
                <span className="data text-xl font-semibold text-ink-1000">₹{price}</span>
                <span className="ml-1 text-xs text-ink-600">/ night</span>
              </p>
              {dostellerPrice ? (
                <span className="tag mt-1.5 inline-block">Dosteller ₹{dostellerPrice}</span>
              ) : null}
            </div>
            <span className="inline-flex h-10 flex-col items-end justify-center rounded-sm bg-coral-600 px-4 text-right text-white transition group-hover:bg-coral-700">
              <span className="text-sm font-semibold leading-none">Hold bed</span>
              <span className="mt-0.5 text-[0.65rem] font-medium opacity-90">from 5% now</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
