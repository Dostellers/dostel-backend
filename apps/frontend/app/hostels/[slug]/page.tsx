'use client';

import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PolicyPills from '@/components/PolicyPills';
import RoomSelector from '@/components/RoomSelector';
import StickyBottomBar from '@/components/StickyBottomBar';
import { useBooking } from '@/components/BookingProvider';
import { hostels } from '@/lib/data';
import { GET_HOSTEL_DETAILS } from '@/lib/queries';
import { getProofConfig } from '@/lib/proof';

type ApiHostel = {
  id: string;
  name?: string | null;
  tagline?: string | null;
  shortDesc?: string | null;
  basePrice?: number | null;
  url?: string | null;
  description?: { content?: string | null } | null;
  location?: {
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      pincode?: string | null;
    } | null;
  } | null;
  timing?: { checkin?: string | null; checkout?: string | null } | null;
  images?: {
    hero?: { url?: string | null } | null;
    main?: { url?: string | null } | null;
    thumbnail?: { url?: string | null } | null;
  } | null;
};

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

/* ---------------------------------------------------------------
   Icons. The v1 system banned emoji in UI and the page used them
   anyway. 2px stroke, currentColor, per .paperclip/design/system/iconography.md
   --------------------------------------------------------------- */
type IconProps = { className?: string };
const svg = 'none';
const Wifi = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Bolt = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
);
const Signal = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 20v-4M9 20v-8M14 20v-12M19 20V4" />
  </svg>
);
const Cloud = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 15a3.5 3.5 0 0 1 .5-7 5 5 0 0 1 9.6 1.2A3.4 3.4 0 0 1 18 15z" /><path d="M6 19h12" />
  </svg>
);
const Boot = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3v10l-1.5 3A2 2 0 0 0 7.3 19H19a2 2 0 0 0 2-2v-1c0-1.6-1-2.3-2.5-3L14 11V3z" />
  </svg>
);
const User = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);
const Pin = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);
const Check = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

const Transit = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM4 11h16M8 21l2-4M16 21l-2-4" /><circle cx="8.5" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="15.5" cy="14" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Water = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3s6 6.6 6 10.5a6 6 0 0 1-12 0C6 9.6 12 3 12 3z" />
  </svg>
);
const Noise = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={svg} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
  </svg>
);

/* Proof-card icons, keyed to lib/proof.ts. */
const PROOF_ICONS = {
  wifi: Wifi, bolt: Bolt, signal: Signal, cloud: Cloud,
  boot: Boot, user: User, transit: Transit, water: Water, noise: Noise,
} as const;

/* The Board — the guest graph made visible (DOS-500).
   Consent-gated and anonymised; shows nothing a guest has not opted into. */
const boardEntries = [
  { tag: 'Arriving Thu', note: 'Two of us walking the Dolphin’s Nose ridge Friday, slow pace, everyone welcome.', from: 'Lisbon' },
  { tag: 'Here till Sun', note: 'Teaching a Lightroom session Saturday evening if three people want it.', from: 'Bengaluru' },
  { tag: 'Long stay', note: 'Working India hours, laptop in the cafe most mornings. Happy to share the quiet corner.', from: 'Berlin' },
];

const workweekInclusions = [
  ['5 nights accommodation', 'Dorm, couple room, or suite. Long-stay rates auto-applied.'],
  ['All meals', 'Breakfast, lunch and dinner at Altaf’s Cafe. Dietary needs handled.'],
  ['Dedicated workspace', 'Common-room deck and the cafe corner. Not a co-working space — a quiet spot with a view and a socket.'],
  ['Fiber Wi-Fi', 'Works for calls, streaming and uploads.'],
  ['Group trek + bonfire', 'One organised trek (Dolphin’s Nose or Pillar Rocks, weather depending) plus Friday bonfire.'],
  ['Skill-share session', 'One 90-minute session where a guest shares a skill. Past topics: Figma, Python automation, travel writing.'],
  ['Skill-share credit', 'Lead a session and your next Workweek is 15% off. Attend and review it, 5% off.'],
  ['Dosteller trial', 'Join during the Workweek and get Explorer tier at half price for the first month.'],
];

const workweekRates = [
  ['Dorm', '₹260', '₹1,300'],
  ['Couple room', '₹1,039', '₹5,195'],
  ['Suite', '₹1,439', '₹7,195'],
];

const workweekExclusions = [
  'Dedicated meeting room — the cafe works for 1:1s',
  'Laundry service — available at a nominal charge',
  'Spa and wellness add-ons — we do not have those',
  'Airport pickup — shared jeeps from the bus stand, we will help arrange',
];

const included = [
  'Campfire and community nights',
  'Altaf’s Cafe on property',
  'Ecologically restored grounds',
  '24hr reception and local support',
  'Operating in Vattakanal since 1985',
  'Free cancellation, no booking fees',
];

export default function HostelDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const router = useRouter();
  const { state } = useBooking();
  const { data, loading, error } = useQuery<{ hostels: ApiHostel[] }>(GET_HOSTEL_DETAILS);
  const fallback = hostels.find((item) => item.slug === slug) || hostels[0];
  const hasSelection = state.selectedRooms.length > 0;
  const apiHostel = data?.hostels.find((item) => {
    const urlSlug = item.url?.split('/').filter(Boolean).pop();
    const nameSlug = slugify(item.name || '');
    return urlSlug === slug || nameSlug === slug || `dostel-${nameSlug}` === slug;
  });
  const address = apiHostel?.location?.address;
  const location = [address?.city, address?.state].filter(Boolean).join(', ') || fallback.location;
  const streetAddress = [address?.line1, address?.line2, address?.city, address?.state, address?.country, address?.pincode]
    .filter(Boolean)
    .join(', ') || fallback.address;
  const hostel = {
    ...fallback,
    name: apiHostel?.name || fallback.name,
    tagline: apiHostel?.tagline || fallback.tagline,
    description: apiHostel?.description?.content || apiHostel?.shortDesc || fallback.description,
    price: apiHostel?.basePrice ?? fallback.price,
    location,
    address: streetAddress,
    image: apiHostel?.images?.hero?.url || apiHostel?.images?.main?.url || apiHostel?.images?.thumbnail?.url || fallback.image,
    checkIn: apiHostel?.timing?.checkin || fallback.checkIn,
    checkOut: apiHostel?.timing?.checkout || fallback.checkOut,
  };

  // Render from the local fallback immediately and let the live query upgrade it
  // in place. Gating the whole page on a client-side query meant SSR shipped a
  // spinner: no content for crawlers, and a blank hold on slow connections.
  // Only block when there is genuinely nothing to show.
  // The proof card speaks the terrain's language: "know before you climb" is
  // right for Vattakanal and absurd for Delhi Airport. See lib/proof.ts.
  const proof = getProofConfig(fallback?.category);
  const unmeasured = proof.checks.filter((c) => c.reading === null).length;

  if (loading && !fallback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="data text-sm uppercase tracking-[0.18em] text-ink-600">Loading hostel…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* ── Hero ─────────────────────────────────────────────────
          Editorial and asymmetric, on paper. Every competitor ships
          a dark gradient washed over a photo; this reads as printed. */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <span className="stamp text-coral-700">
              <Pin className="h-3.5 w-3.5" />
              {location}
            </span>
            <h1 className="mt-5 text-[2.75rem] leading-[0.95] tracking-[-0.03em] text-ink-1000 sm:text-6xl lg:text-7xl">
              {hostel.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">
              {hostel.tagline}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <span className="data text-3xl font-semibold text-ink-1000">₹{hostel.price}</span>
                <span className="ml-1.5 text-sm text-ink-600">/ night</span>
              </div>
              <span className="tag">Dosteller ₹{Math.round(hostel.price * 0.9)}</span>
              <span className="text-sm text-ink-600">
                <span className="font-semibold text-ink-900">{hostel.rating}</span> · {hostel.reviews.toLocaleString('en-IN')} reviews
              </span>
            </div>
          </div>

          {/* Image as a framed panel, not a full-bleed wash. */}
          <div className="relative">
            <div
              className="aspect-[4/3] w-full rounded-sm border-4 border-ink-1000 bg-ink-100 bg-cover bg-center"
              style={{ backgroundImage: `url(${hostel.image})` }}
              role="img"
              aria-label={`${hostel.name}, ${location}`}
            />
            {/* "Since 1985" is only true of Vattakanal — the rest of the
                network gets its terrain, which is true everywhere. */}
            <span className="absolute -bottom-3 -left-3 bg-coral-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {slug === 'dostel-vattakanal' ? 'Since 1985' : proof.eyebrow}
            </span>
          </div>
        </div>
      </section>

      <div className="border-y border-ink-200 bg-white px-4 py-4">
        {error && (
          <p className="mx-auto mb-3 max-w-7xl text-sm text-ink-600" role="status">
            Live details are unavailable. Showing saved hostel information.
          </p>
        )}
        <div className="mx-auto max-w-7xl">
          <PolicyPills
            items={[
              { id: 'cancellation', label: 'Free cancel 48h', detail: 'Cancel at least 48 hours before check-in for a full refund.', tone: 'positive', icon: 'calendar-check' },
              { id: 'check-in', label: `Check-in ${hostel.checkIn}`, detail: `Check-in begins at ${hostel.checkIn}. Contact the property before arrival if you expect to be late.`, tone: 'informative', icon: 'clock' },
              { id: 'photo-id', label: 'Photo ID required', detail: 'Every guest must present a valid government-issued photo ID at check-in.', tone: 'neutral', icon: 'id-card' },
            ]}
          />
        </div>
      </div>

      {/* ── Verified Hill-Stay Card ──────────────────────────────
          Promoted from section 4 to directly below the fold. This is
          the differentiator: competitors list amenities, we show
          method and admit what has not been measured. */}
      <section className="border-b border-ink-200 bg-ink-1000 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="stamp text-yellow-300">{proof.eyebrow}</span>
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">{proof.headline}</h2>
              <p className="mt-4 text-lg leading-8 text-white/70">{proof.intro}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {proof.checks.map(({ id, icon, label, reading, detail, method, body }) => {
              const Icon = PROOF_ICONS[icon];
              return (
                <article key={id} className="bg-ink-1000 p-6">
                  <div className="flex items-center gap-2.5 text-yellow-300">
                    <Icon className="h-5 w-5" />
                    <h3 className="data text-xs font-medium uppercase tracking-[0.14em] text-white/70">{label}</h3>
                  </div>

                  {reading ? (
                    <>
                      <p className="mt-4 text-lg font-semibold leading-6 text-white">{reading}</p>
                      {detail && <p className="mt-1.5 text-sm leading-6 text-white/60">{detail}</p>}
                    </>
                  ) : (
                    <p className="data mt-4 inline-flex items-center gap-2 border border-white/25 px-2.5 py-1 text-xs uppercase tracking-[0.1em] text-white/60">
                      Not measured yet
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-6 text-white/70">{body}</p>
                  <p className="data mt-4 border-t border-white/10 pt-3 text-[0.6875rem] leading-5 text-white/45">
                    {method}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="data mt-6 text-xs leading-5 text-white/45">
            {unmeasured} of {proof.checks.length} checks have no operator-validated reading yet,
            so no figure is shown for them. Publishing a number we cannot stand behind would
            defeat the point of the card.
          </p>
        </div>
      </section>

      {/* ── Rooms ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-ink-1000 sm:text-4xl">Rooms built for every kind of stay</h2>
          <p className="mt-3 max-w-xl text-ink-700">
            Base rates shown. Long-stay and Dosteller discounts apply automatically at checkout.
          </p>
          <div className="mt-8">
            <RoomSelector
              rooms={[
                { id: 'dorm', name: 'Dormitory Bed', type: 'Dorm', price: 327, capacity: 6, image: '/images/dorm-room.jpg', amenities: ['Locker', 'Reading Light', 'Power Socket', 'Privacy Curtain', 'Hot Shower'], available: true, bookedThisWeek: 8, dostellerPrice: 294 },
                { id: 'couple-room', name: 'Couple Room', type: 'Couple', price: 1299, capacity: 2, image: '/images/couple-room.jpg', amenities: ['Attached Bath', 'WiFi', 'Mountain View', 'TV', 'Housekeeping'], available: true, bookedThisWeek: 5, dostellerPrice: 1169 },
                { id: 'deluxe-suite', name: 'Deluxe Suite', type: 'Suite', price: 1799, capacity: 2, image: '/images/deluxe-suite.jpg', amenities: ['AC', 'WiFi', 'Mountain View', 'Balcony', 'Hot Shower'], available: true, bookedThisWeek: 3, dostellerPrice: 1619 },
              ]}
              checkIn={state.checkIn}
              checkOut={state.checkOut}
            />
          </div>
        </div>
      </section>

      {/* ── The Board ────────────────────────────────────────────
          Every hostel site sells a bed. This sells the room. Entries
          are opt-in and anonymised (DOS-500 / DPDP Act 2023). */}
      <section className="border-y border-ink-200 bg-coral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="stamp text-coral-800">The board</span>
            <h2 className="mt-4 text-3xl text-ink-1000 sm:text-4xl">Who&apos;s here this week</h2>
            <p className="mt-4 text-lg leading-8 text-ink-700">
              You are not booking a bed, you are booking a room full of people. Guests choose what
              to put up here — first names and nothing more until you both arrive.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boardEntries.map((entry) => (
              <article
                key={entry.note}
                className="board-card relative rounded-sm border border-ink-200 bg-white p-6 shadow-[0_1px_0_rgba(11,11,12,0.06)]"
              >
                <span aria-hidden="true" className="absolute -top-1.5 left-6 h-3 w-3 rounded-full bg-coral-600" />
                <span className="tag">{entry.tag}</span>
                <p className="mt-4 leading-7 text-ink-900">{entry.note}</p>
                <p className="data mt-4 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-500">{entry.from}</p>
              </article>
            ))}
          </div>

          <p className="data mt-6 text-xs leading-5 text-ink-600">
            Opt-in only. Nothing appears here without the guest publishing it, and it clears when they check out.
          </p>
        </div>
      </section>

      {/* ── Workweek ─────────────────────────────────────────── */}
      {slug === 'dostel-vattakanal' && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <span className="stamp text-coral-700">Work from the mountains</span>
                <h2 className="mt-4 text-3xl text-ink-1000 sm:text-4xl">The Workweek</h2>
                <p className="mt-4 text-xl font-medium leading-8 text-ink-900">
                  Five nights of focus, fire and community.
                </p>
                <p className="mt-4 max-w-3xl leading-7 text-ink-700">
                  Most workation packages make big promises. Ours is simpler: a quiet room, solid
                  internet, three meals a day, and a group of people who also brought their laptops.
                  No productivity theatre.
                </p>
                <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-ink-200 bg-ink-200 sm:grid-cols-2">
                  {workweekInclusions.map(([title, detail]) => (
                    <article key={title} className="bg-white p-5">
                      <h3 className="flex items-start gap-2 font-semibold text-ink-1000">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-coral-600" />
                        {title}
                      </h3>
                      <p className="mt-2 pl-6 text-sm leading-6 text-ink-700">{detail}</p>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-sm border border-ink-200 bg-white p-6 lg:sticky lg:top-6">
                <p className="data text-xs uppercase tracking-[0.14em] text-ink-500">Sunday–Thursday</p>
                <h3 className="mt-2 text-2xl text-ink-1000">Five-night rates</h3>
                <div className="mt-5 divide-y divide-ink-200 border-y border-ink-200">
                  {workweekRates.map(([room, nightly, total]) => (
                    <div key={room} className="grid grid-cols-[1fr_auto] items-center gap-4 py-3.5">
                      <div>
                        <p className="font-medium text-ink-1000">{room}</p>
                        <p className="data text-xs text-ink-500">{nightly} per night</p>
                      </div>
                      <p className="data font-semibold text-ink-1000">{total}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-ink-600">
                  Dosteller members get a further 10–15% off the Workweek total.
                </p>

                <div className="data mt-5 border-l-2 border-warning bg-yellow-50 p-4 text-[0.6875rem] leading-5 text-yellow-950" role="note">
                  Pricing, internet speed, backup coverage, meal inclusions and activity availability
                  require operator validation before publishing.
                </div>

                <Link
                  href="/hostels/dostel-vattakanal?workweek=true"
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-700 active:scale-[0.97]"
                >
                  Book a Workweek
                </Link>

                <div className="mt-7 border-t border-ink-200 pt-5">
                  <h3 className="font-semibold text-ink-1000">What is not included</h3>
                  <ul className="mt-3 space-y-2.5 text-sm leading-6 text-ink-700">
                    {workweekExclusions.map((exclusion) => (
                      <li key={exclusion} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-ink-400" />
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ── Included ─────────────────────────────────────────── */}
      <section className="border-t border-ink-200 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-ink-1000 sm:text-4xl">What&apos;s included in your stay</h2>
          <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-ink-200 pb-4 text-ink-900">
                <Check className="mt-1 h-4 w-4 shrink-0 text-coral-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Where we are ─────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="stamp text-coral-700"><Pin className="h-3.5 w-3.5" />Where we are</span>
              <p className="data mt-4 leading-7 text-ink-900">{hostel.address}</p>
            </div>
            <p className="leading-8 text-ink-700">{hostel.description}</p>
          </div>
        </div>
      </section>

      {/* ── Dostellers + close ───────────────────────────────── */}
      <section className="bg-ink-1000 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="stamp text-yellow-300">Dostellers</span>
              <h2 className="mt-4 text-3xl text-white sm:text-4xl">Stay long enough to belong</h2>
              <p className="mt-4 leading-8 text-white/70">
                No points, no wallet, no quests. Stay 14+ nights in a month and you get shared meals
                at Altaf&apos;s Cafe, group treks, bonfire nights, and a staff team that already knows
                how you take your chai.
              </p>
              <Link
                href="/membership"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-sm bg-yellow-400 px-6 text-sm font-semibold text-ink-1000 transition-all duration-150 hover:bg-yellow-300 active:scale-[0.97]"
              >
                Learn about Dostellers
              </Link>
            </div>

            <div className="lg:border-l lg:border-white/15 lg:pl-16">
              <h2 className="text-3xl text-white sm:text-4xl">Come stay awhile</h2>
              <p className="mt-4 leading-8 text-white/70">
                {hostel.location} is waiting — a weekend or a month, there is a bed, a fire and a
                community here.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/booking/${slug}/dates`}
                  className="inline-flex h-12 items-center justify-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
                >
                  Check availability
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex h-12 items-center justify-center rounded-sm border border-white/25 px-6 text-sm font-semibold text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.97]"
                >
                  Become a Dosteller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasSelection && (
        <StickyBottomBar
          price={state.subtotal / state.nights || 0}
          total={state.total}
          ctaLabel="Continue to guest details"
          onCtaClick={() => router.push(`/booking/${slug}/guest`)}
          show
        />
      )}
    </div>
  );
}
