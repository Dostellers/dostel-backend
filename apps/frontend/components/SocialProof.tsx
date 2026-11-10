import { TrendingIcon } from "./Icons";

export type ReviewVariant = 'card' | 'detail' | 'badge';

export interface ReviewItem {
  id: string;
  name: string;
  rating: number; // 1-5
  date: string; // ISO date, displayed as "3 days ago"
  avatar?: string;
  verified: boolean;
  stayLength?: number; // nights, for Dosteller identification
}

export interface SocialProofProps {
  reviews?: readonly ReviewItem[];
  bookedThisWeek?: number;
  totalDostellers?: number;
  variant: ReviewVariant;
  className?: string;
  'aria-label'?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse rounded-md h-24 bg-stone-200/20"></div>
  );
}

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="bg-white shadow-sm rounded-md p-4 text-sm text-stone-600">
      <div className="flex items-center gap-2">
        {review.avatar ? (
          <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-stone-200/20 flex items-center justify-center">{review.name[0]}</div>
        )}
        <span className="font-medium text-forest-900">{review.name}</span>
        {review.verified && (
          <span aria-label="Verified traveller" role="status">
            ✓
          </span>
        )}
      </div>
      <StarRating rating={review.rating} />
      <div>
        {new Date(review.date).toLocaleDateString('en-US', { timeAgo: true })}
      </div>
      {review.stayLength && <span>{review.stayLength} nights</span>}
    </div>
  );
}

export default function SocialProof({
  reviews,
  bookedThisWeek,
  totalDostellers,
  variant = 'card',
  className = '',
  label = 'Reviews',
}: SocialProofProps) {
  if (!bookedThisWeek && !reviews?.length && !totalDostellers) {
    return null;
  }

  if (variant === 'badge') {
    if (!totalDostellers) return null;
    return (
      <span
        role="img"
        aria-label={`Trusted by ${totalDostellers} Dostellers`}
        className="inline-flex items-center gap-1 rounded-full bg-forest-500 px-3 py-1 text-xs font-semibold text-white focus:outline-2 focus:outline-sky-500 focus:outline-offset-2"
      >
        <TrendingIcon className="h-3 w-3" />
        <span>Trusted by {totalDostellers}+ Dostellers</span>
      </span>
    );
  }

  if (variant === 'detail') {
    if (!reviews) return <SkeletonLoader />;
    return (
      <div
        role="list"
        aria-label={label}
        className="flex overflow-x-auto gap-3 pb-2 scroll-px-1 snap-x snap-mandatory"
      >
        {reviews.slice(0, 5).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  // Card variant
  return (
    <p
      role="status"
      aria-live="polite"
      className="text-xs text-stone-600 flex items-center gap-1"
    >
      <TrendingIcon className="h-3 w-3" />
      <span>
        {bookedThisWeek ? `${bookedThisWeek} booked this week` : 'Recently booked'}
      </span>
    </p>
  );
}
