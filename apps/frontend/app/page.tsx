import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";
import { events } from "@/lib/data";

const roomTypes = [
  {
    name: "Dorms",
    description: "A shared room for solo travellers and new friends.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
  },
  {
    name: "Couple rooms",
    description: "A private room for two in the heart of the hostel.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    name: "Private suites",
    description: "More room to settle in and stay awhile.",
    image: "https://images.unsplash.com/photo-1631049421450-348ccd7f2949?w=800&q=80",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-snow">
      {/* Hero Section */}
      <section className="relative h-[90vh] sm:h-[85vh] min-h-[600px] overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-snow/20 to-snow/60 z-[1]" />

        <div className="relative z-[2] flex h-full w-full items-end pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to Dostel<br />
              <span className="block">A community hostel in the mountains of Vattakanal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Perched in the misty forests of Kodaikanal. Built on a story of restoration — inspired by Bob & Tanya (1985). This is a place you stay, not just sleep.
            </p>
            <div className="max-w-[480px] mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards (replacing generic 3-column section) */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Card 1 — The Story */}
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-forest-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-forest-700">🌱</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest-900">
                Rooted in restoration
              </h3>
              <p className="text-stone-400 text-center max-w-xs">
                In 1985, Bob & Tanya came to Vattakanal and never left. They restored the land, grew a community, and planted the seed for what Dostel is today. Forty years later, we&apos;re still tending that garden.
              </p>
            </div>

            {/* Card 2 — Dostellers */}
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-sunset/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-sunset">🔥</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest-900">
                The Dostellers
              </h3>
              <p className="text-stone-400 text-center max-w-xs">
                More than guests — community members. Stay long enough to unlock the network: shared meals at Altaf&apos;s Cafe, group treks to Dolphin&apos;s Nose, bonfire nights under the Kodaikanal sky.
              </p>
            </div>

            {/* Card 3 — The Place */}
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-forest-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-forest-500">🏔️</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest-900">
                Vattakanal, Kodaikanal
              </h3>
              <p className="text-stone-400 text-center max-w-xs">
                Not a resort. Not a co-working chain. A mountain hostel at 2,000m where the rainforest meets a backpacker&apos;s curiosity. Suites, couple rooms, dorms — something for every kind of traveler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms built for every kind of stay (replacing Featured Hostels) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900">
                Rooms built for every kind of stay
              </h2>
              <p className="text-sm text-stone-400">
                From solo dorms to private suites — all with mountain light and community spirit
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomTypes.map((room) => (
                <article key={room.name} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <h3 className="font-heading text-xl font-semibold text-forest-900">{room.name}</h3>
                    <p className="text-sm text-stone-600">{room.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bob & Tanya Brand Story Block (new section) */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900">
                It started with two backpackers
              </h2>
              <p className="text-stone-600 text-lg max-w-xl">
                Bob & Tanya arrived in Vattakanal in 1985. British travelers who fell in love with a hillside and never caught their flight home. They planted trees, built a home, and opened their doors to other wanderers. The land they restored became the foundation of Dostel. Forty years later, we&apos;re still welcoming travelers the same way — with tea, a warm bed, and room at the table.
              </p>
            </div>
            <div className="relative hidden h-96 w-full overflow-hidden rounded-xl lg:block">
              <Image
                src="https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1200&q=85"
                alt="Misty mountain forest"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-forest-100 text-forest-800 rounded-full">
                Vattakanal & beyond
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900">
                Upcoming Events
              </h2>
              <Link href="/events" className="text-sm text-stone-400 hover:text-forest-500 transition-colors flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 3).map((event) => (
                  <Link key={event.slug} href={`/events/${event.slug}`} className="group block bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-250 hover:-translate-y-0.5">
                    <div className="relative aspect-video">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 text-xs font-medium bg-sunset text-white rounded-full">
                          {event.categoryLabel}
                        </span>
                      </div>

                      {event.spotsLeft < 15 && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 text-xs font-medium bg-amber-400 text-forest-900 rounded-full">
                            {event.spotsLeft} left
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-heading text-lg font-semibold text-white mb-1">
                          {event.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {event.date} · {event.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-stone-600 text-sm line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-forest-900">₹{event.price.toLocaleString()}</p>
                          <p className="text-xs text-stone-400 line-through">₹{event.originalPrice.toLocaleString()}</p>
                        </div>
                        <span className="inline-flex h-9 items-center rounded-lg bg-forest-500 px-4 text-sm font-medium text-white transition-all duration-150 active:scale-[0.97] hover:brightness-95">
                          Reserve
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">
                  No upcoming events — check back soon. Or ask at reception about this week&apos;s treks and bonfires.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div>
              <span className="text-2xl mb-2 block">🏔️</span>
              <p className="text-sm font-medium text-forest-900">Real Vattakanal hostel since 1985</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">☕</span>
              <p className="text-sm font-medium text-forest-900">Altaf&apos;s Cafe on property</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🔥</span>
              <p className="text-sm font-medium text-forest-900">Campfire & community nights</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">✅</span>
              <p className="text-sm font-medium text-forest-900">Free cancellation — no booking fees</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🌿</span>
              <p className="text-sm font-medium text-forest-900">Ecologically restored grounds</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">📞</span>
              <p className="text-sm font-medium text-forest-900">24hr reception + local support</p>
            </div>
          </div>
          <p className="mt-8 text-stone-600 max-w-2xl mx-auto text-center">
            Dostel isn&apos;t a chain. It&apos;s one hostel in one mountain town — run by people who know every trail, every cafe owner, and every firefly spot on the hillside.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-forest-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6">
            Come stay awhile
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Vattakanal is waiting. Whether you&apos;re passing through for a weekend or staying for a month — there&apos;s a bed, a fire, and a community here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/hostels/dostel-vattakanal"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-6 text-sm font-medium text-white transition-all duration-150 hover:bg-white/20 active:scale-[0.97]"
            >
              Book a room
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