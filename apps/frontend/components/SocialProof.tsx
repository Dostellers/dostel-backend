import { TrendingIcon } from './Icons'

export type ReviewVariant = 'card' | 'detail' | 'badge'

export interface ReviewItem {
  id: string
  name: string
  rating: number
  date: string
  avatar?: string
  verified: boolean
  stayLength?: number
}

export interface SocialProofProps {
  reviews?: readonly ReviewItem[]
  bookedThisWeek?: number
  /** Legacy alias used by RoomSelector / older HostelCard callers */
  count?: number
  totalDostellers?: number
  variant?: ReviewVariant
  className?: string
  label?: string
  'aria-label'?: string
}

function StarRating ({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

function SkeletonLoader () {
  return <div className="h-24 animate-pulse rounded-sm bg-ink-100" />
}

function formatReviewWhen (isoDate: string) {
  const then = new Date(isoDate).getTime()
  if (Number.isNaN(then)) return ''
  const daysAgo = Math.max(0, Math.round((Date.now() - then) / 86_400_000))
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  return `${daysAgo} days ago`
}

function ReviewCard ({ review }: { review: ReviewItem }) {
  const when = formatReviewWhen(review.date)

  return (
    <div className="guestbook-card min-w-[220px] snap-start rounded-sm border border-ink-200 bg-white p-4 text-sm text-ink-700">
      <div className="flex items-center gap-2">
        {review.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="avatar-chip" aria-hidden>{review.name[0]}</span>
        )}
        <span className="font-medium text-ink-1000">{review.name}</span>
        {review.verified ? (
          <span className="stamp border-success/40 text-success" aria-label="Verified traveller">
            ✓
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-coral-700">
        <StarRating rating={review.rating} />
      </div>
      <p className="data mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-ink-400">{when}</p>
      {review.stayLength ? (
        <p className="mt-1 text-xs text-ink-500">{review.stayLength} nights</p>
      ) : null}
    </div>
  )
}

export default function SocialProof ({
  reviews,
  bookedThisWeek,
  count,
  totalDostellers,
  variant = 'card',
  className = '',
  label = 'Reviews',
}: SocialProofProps) {
  const weekCount = bookedThisWeek ?? count

  if (!weekCount && !reviews?.length && !totalDostellers) {
    return null
  }

  if (variant === 'badge') {
    if (!totalDostellers) return null
    return (
      <span
        role="img"
        aria-label={`Trusted by ${totalDostellers} Dostellers`}
        className={`stamp inline-flex items-center gap-1 border-coral-400 text-coral-700 ${className}`}
      >
        <TrendingIcon className="h-3 w-3" />
        Trusted by {totalDostellers}+ Dostellers
      </span>
    )
  }

  if (variant === 'detail') {
    if (!reviews) return <SkeletonLoader />
    return (
      <div
        role="list"
        aria-label={label}
        className={`flex gap-3 overflow-x-auto scroll-px-1 pb-2 snap-x snap-mandatory ${className}`}
      >
        {reviews.slice(0, 5).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    )
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-1 flex items-center gap-1 text-xs text-ink-600 ${className}`}
    >
      <TrendingIcon className="h-3 w-3 text-coral-600" />
      <span>
        {weekCount ? `${weekCount} ${label || 'booked this week'}` : 'Recently booked'}
      </span>
    </p>
  )
}
