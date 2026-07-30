'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import HostelCard from '@/components/HostelCard';
import PolicyPills from '@/components/PolicyPills';
import { hostels } from '@/lib/data';
import { GET_HOSTEL_DETAILS } from '@/lib/queries';

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

const reliabilityItems = [
  {
    icon: "📶",
    iconLabel: "Wi-Fi signal",
    title: "Fiber Wi-Fi",
    body: '50 Mbps fiber. Reliable for Zoom, Slack, and code pushes. Not "co-working speed" — just real internet that works. Speed is consistent through the day; peak usage (evenings) may dip slightly but stays usable for calls.',
    measurement: "Wi-Fi speed = measured at 10 AM local (IST, non-peak) on the main router. Real-world evening speeds may be lower during peak usage.",
  },
  {
    icon: "⚡",
    iconLabel: "Power",
    title: "Power backup",
    body: "Generator covers outages. Hot water uses a separate heating system, so even during a full load-shedding window, hot water and Wi-Fi stay on.",
    measurement: "Power backup = generator automatic-switch coverage for common areas + WiFi router + hostel kitchen. Private rooms with AC have separate wiring; AC runs on mains with backup for common lighting.",
  },
  {
    icon: "🌫️",
    iconLabel: "Misty weather",
    title: "Weather",
    body: "Kodaikanal is cool and misty year-round (10–25°C). Mornings are the best window for clear views. Afternoons can bring rain — raincoat in your bag is non-negotiable, umbrella optional (the mountains ignore umbrellas).",
  },
  {
    icon: "🥾",
    iconLabel: "Walking",
    title: "Walk to Vattakanal village",
    body: "5-minute downhill walk. Auto back to Kodaikanal bus stand is 15 min. No need for a car unless you're heading to the lake or a distant viewpoint.",
  },
  {
    icon: "👤",
    iconLabel: "Host",
    title: "Host & community",
    body: "We're on-site 24/7. Not just reception — people who live here, know every trail, and will point you to the best bonfire spot. Ask us anything at any hour.",
  },
  {
    icon: "📡",
    iconLabel: "Mobile signal",
    title: "Mobile signal",
    body: "Jio and Airtel work well in Vattakanal. BSNL is inconsistent. Vodafone is unreliable above 1,800m. Don't count on one carrier — carry both Jio and Airtel SIMs if you rely on mobile data as backup.",
    measurement: "Mobile signal = tested on 4G LTE at the hostel reception point. Signal varies by building/room location and carrier.",
  },
];

const workweekInclusions = [
  ["5 nights accommodation", "Dorm, couple room, or suite (your choice). Long-stay rates auto-applied."],
  ["All meals", "Breakfast + lunch + dinner at Altaf's Cafe. Parathas, thali, chai, coffee. Dietary needs handled."],
  ["Dedicated workspace", "Common room deck + Altaf's cafe corner. Not a fancy co-working space — just a quiet spot with a view and a power outlet."],
  ["Fiber Wi-Fi", "50 Mbps. Works for calls, streaming, and uploads."],
  ["Group trek + bonfire", "One organized group trek (Dolphin's Nose or Pillar Rocks, depending on weather) + bonfire night on Friday. Optional but encouraged."],
  ["Skill-share session", "One 90-minute session where a Workweek guest shares a skill. We'll match you with the group. Past topics: Figma prototyping, Python automation, solo travel writing, Lightroom editing."],
  ["Skill-share credit", "If you lead a session, your next Workweek booking gets 15% off. If you attend and give a 1-line review on the skill-share board, your next booking gets 5% off."],
  ["Dosteller trial", "Sign up for Dosteller membership during the Workweek and get Explorer tier at 50% off the first month."],
];

const workweekRates = [
  ["Dorm", "₹260 (-20% off ₹327)", "₹1,300"],
  ["Couple room", "₹1,039 (-20% off ₹1,299)", "₹5,195"],
  ["Suite", "₹1,439 (-20% off ₹1,799)", "₹7,195"],
];

const workweekExclusions = [
  "Dedicated meeting room (the cafe works for 1:1s)",
  "Laundry service (available at nominal charge, not included)",
  "Spa / wellness add-ons (we don't have those yet)",
  "Airport pickup (shared jeeps from Kodaikanal bus stand; we'll help arrange)",
];

export default function HostelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useQuery<{ hostels: ApiHostel[] }>(GET_HOSTEL_DETAILS);
  const fallback = hostels.find((item) => item.slug === slug) || hostels[0];
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
  if (loading) {
    return <div className="min-h-screen bg-snow flex items-center justify-center text-forest-900">Loading hostel...</div>;
  }

  return (
    <div className="min-h-screen bg-snow">
      <section
        className="relative h-[70vh] sm:h-[60vh] min-h-[500px] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${hostel.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/80 to-forest-900/70" />
        <div className="relative z-[2] flex h-full w-full items-end pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {hostel.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-4">
              {hostel.tagline}
            </p>
            <div className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-white/20 text-white rounded-full">
              {location}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white px-4 pt-4">
        {error && (
          <p className="mx-auto mb-3 max-w-7xl text-sm text-stone-600" role="status">
            Live details are unavailable. Showing saved hostel information.
          </p>
        )}
        <PolicyPills
          policies={[
            { label: "Free cancel 48h" },
            { label: `Check-in ${hostel.checkIn}` },
            { label: "ID required" }
          ]}
        />
      </div>

      {/* Room Types Section */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900 mb-8">
            Rooms built for every kind of stay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dorm */}
            <HostelCard
              slug="dorm"
              name="Dormitory Bed"
              location="Vattakanal, Kodaikanal"
              tagline="Shared rooms with mountain light and locker access"
              price={327}
              rating={4.8}
              reviewCount={124}
              image="/images/dorm-room.jpg"
              tags={[ "Dorm", "Budget", "Social" ]}
              isNew={false}
              isTrending={false}
              bookedThisWeek={8}
              dostellerPrice={294} // 10% discount for Dostellers
            />
            {/* Couple Room */}
            <HostelCard
              slug="couple-room"
              name="Couple Room"
              location="Vattakanal, Kodaikanal"
              tagline="Private rooms for two, perfect for couples or solo travelers wanting space"
              price={1299}
              rating={4.9}
              reviewCount={98}
              image="/images/couple-room.jpg"
              tags={[ "Couple", "Private", "Mountain View" ]}
              isNew={false}
              isTrending={false}
              bookedThisWeek={5}
              dostellerPrice={1169} // 10% discount for Dostellers
            />
            {/* Deluxe Suite */}
            <HostelCard
              slug="deluxe-suite"
              name="Deluxe Suite"
              location="Vattakanal, Kodaikanal"
              tagline="Spacious suites with sitting area and mountain views"
              price={1799}
              rating={4.9}
              reviewCount={87}
              image="/images/deluxe-suite.jpg"
              tags={[ "Suite", "Premium", "Mountain View" ]}
              isNew={false}
              isTrending={false}
              bookedThisWeek={3}
              dostellerPrice={1619} // 10% discount for Dostellers
            />
          </div>
          <p className="mt-6 text-center text-stone-600">
            *Prices shown are base rates. Long-stay and Dosteller discounts apply.
          </p>
        </div>
      </section>

      {slug === "dostel-vattakanal" && (
        <>
          <section className="bg-forest-900 py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">The honest mountain check</p>
                <h2 className="font-heading text-3xl font-semibold md:text-4xl">Know before you climb</h2>
                <p className="mt-4 text-lg leading-8 text-white/75">
                  Vattakanal is real. The internet, the power, the mist — all of it. Here&apos;s what to expect so you can pack right and work confidently.
                </p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reliabilityItems.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl" role="img" aria-label={item.iconLabel}>{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                          {item.measurement && (
                            <span className="group relative inline-flex">
                              <button
                                type="button"
                                aria-label={`How ${item.title.toLowerCase()} is measured`}
                                aria-describedby={`measurement-${slugify(item.title)}`}
                                className="flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-xs text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                              >
                                i
                              </button>
                              <span
                                id={`measurement-${slugify(item.title)}`}
                                role="tooltip"
                                className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-lg bg-white p-3 text-xs leading-5 text-forest-900 shadow-xl group-hover:block group-focus-within:block"
                              >
                                {item.measurement}
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/75">{item.body}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/hostels/dostel-vattakanal" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-forest-900 transition hover:bg-white/90">
                  Book a room in Vattakanal
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sunset">Work from the mountains</p>
                  <h2 className="font-heading text-3xl font-semibold text-forest-900 md:text-4xl">The Workweek</h2>
                  <p className="mt-4 text-xl font-medium text-forest-900">5 nights of focus, fire, and community. Remote work with the mountain doing the heavy lifting.</p>
                  <p className="mt-5 max-w-3xl leading-7 text-stone-600">
                    Most workation packages make big promises. Ours is simpler: a quiet room, solid internet, three meals a day, and a community of people who also brought their laptops. No productivity theater — just a mountain base that actually works for remote work.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {workweekInclusions.map(([title, detail]) => (
                      <article key={title} className="rounded-xl border border-stone-200 p-5">
                        <h3 className="font-heading font-semibold text-forest-900">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{detail}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <aside className="h-fit rounded-2xl bg-snow p-6 lg:sticky lg:top-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Sunday–Thursday</p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-forest-900">Five-night rates</h3>
                  <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
                    {workweekRates.map(([room, nightly, total]) => (
                      <div key={room} className="grid grid-cols-[1fr_auto] gap-4 border-b border-stone-200 p-4 last:border-0">
                        <div>
                          <p className="font-medium text-forest-900">{room}</p>
                          <p className="text-xs text-stone-500">{nightly} per night</p>
                        </div>
                        <p className="font-heading font-semibold text-forest-900">{total}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-stone-500">Workweek rate is available Sunday–Thursday bookings. Dosteller members get an additional 10–15% off the Workweek total.</p>
                  <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-900" role="note">
                    Pricing, internet speed, backup coverage, meal inclusions, discounts, and activity availability require operator validation before publishing.
                  </div>
                  <Link href="/hostels/dostel-vattakanal?workweek=true" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-sunset px-6 text-sm font-semibold text-white transition hover:brightness-95">
                    Book a Workweek
                  </Link>
                  <div className="mt-8 border-t border-stone-200 pt-6">
                    <h3 className="font-heading font-semibold text-forest-900">What&apos;s NOT included (we&apos;re honest about this)</h3>
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-600">
                      {workweekExclusions.map((exclusion) => (
                        <li key={exclusion} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sunset" />
                          <span>{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Amenities Section */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900 mb-8">
            What&apos;s included in your stay
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div>
              <span className="text-2xl mb-2 block">🔥</span>
              <p className="text-sm font-medium text-forest-900">Campfire & community nights</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">☕</span>
              <p className="text-sm font-medium text-forest-900">Altaf&apos;s Cafe on property</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🌿</span>
              <p className="text-sm font-medium text-forest-900">Ecologically restored grounds</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">📞</span>
              <p className="text-sm font-medium text-forest-900">24hr reception + local support</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🏔️</span>
              <p className="text-sm font-medium text-forest-900">Real Vattakanal hostel since 1985</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🧳</span>
              <p className="text-sm font-medium text-forest-900">Free cancellation — no booking fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            Where we are
          </h2>
          <p className="text-stone-600 mb-6">
            {hostel.description}
          </p>
          <p className="text-stone-600 text-center">
            {hostel.address}
          </p>
        </div>
      </section>

      {/* The Dostellers Section */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            Stay long enough to belong
          </h2>
          <p className="text-stone-600 mb-8">
            Our Dostellers program rewards long stays and repeat visitors. Stay 14+ nights in a month to unlock: shared meals at Altaf&apos;s Cafe, group treks to Dolphin&apos;s Nose, bonfire nights, and access to the Dostellers WhatsApp group.
          </p>
          <div className="flex justify-center">
            <Link
              href="/membership"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-sunset px-6 text-sm font-medium text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
            >
              Learn about Dostellers
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-forest-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6">
            Come stay awhile
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            {hostel.location} is waiting. Whether you&apos;re passing through for a weekend or staying for a month — there&apos;s a bed, a fire, and a community here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`/booking/${slug}/dates`}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-6 text-sm font-medium text-white transition-all duration-150 hover:bg-white/20 active:scale-[0.97]"
            >
              Check availability
            </Link>
            <Link
              href="/membership"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-sunset px-6 text-sm font-medium text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
            >
              Become a Dosteller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}