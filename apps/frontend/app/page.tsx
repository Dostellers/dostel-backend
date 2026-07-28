import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import TrustTicker from "@/components/TrustTicker";
import SearchBar from "@/components/SearchBar";
import HostelCard from "@/components/HostelCard";
import { hostels, events } from "@/lib/data";

function bookingCount(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
  }
  return (Math.abs(hash) % 20) + 5;
}

export default function HomePage() {
  const trending = hostels.filter((h) => h.isTrending);

  return (
    <div className="min-h-screen bg-snow">
      {/* Hero Section */}
      <section className="relative h-[90vh] sm:h-[85vh] min-h-[600px] overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-snow/20 to-snow/60 z-[1]" />

        <div className="relative z-[2] flex h-full w-full items-end pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Extraordinary Stays<br /><span className="block">Where Every Journey Becomes a Story</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              From Himalayan retreats to coastal getaways, experience hospitality that transforms travel into transformation
            </p>
            <div className="max-w-[480px] mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-forest-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-forest-700">🏨</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest-900">Curated Collections</h3>
              <p className="text-stone-400 text-center max-w-xs">
                Handpicked hostels that match your travel style — from social hubs to peaceful sanctuaries
              </p>
            </div>
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-sunset/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-sunset">🎪</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest-900">Live Experiences</h3>
              <p className="text-stone-400 text-center max-w-xs">
                Events, workshops, and gatherings that connect travelers with local culture and community
              </p>
            </div>
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-forest-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-forest-500">🌍</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest-900">Global Community</h3>
              <p className="text-stone-400 text-center max-w-xs">
                Join 2M+ travelers sharing stories, tips, and unforgettable moments across India and beyond
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900">
                Featured Hostels
              </h2>
              <Link href="/hostels" className="text-sm text-stone-400 hover:text-forest-500 transition-colors flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.slice(0, 4).map((hostel) => (
                <HostelCard
                  key={hostel.slug}
                  slug={hostel.slug}
                  name={hostel.name}
                  location={hostel.location}
                  tagline={hostel.tagline}
                  price={hostel.price}
                  rating={hostel.rating}
                  reviewCount={hostel.reviews}
                  image={hostel.image}
                  tags={hostel.tags}
                  isNew={hostel.isNew}
                  isTrending={hostel.isTrending}
                  bookedThisWeek={bookingCount(hostel.slug)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="flex items-center justify-between">
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
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustTicker className="mb-12" />
          <div className="text-center">
            <p className="text-stone-400 max-w-2xl mx-auto">
              Travel with confidence knowing every stay meets our rigorous standards for safety, cleanliness, and hospitality
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-forest-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6">
            Ready for your next adventure?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Whether you&apos;re seeking connection, solitude, or celebration — we have the perfect space waiting for you
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/hostels"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-6 text-sm font-medium text-white transition-all duration-150 hover:bg-white/20 active:scale-[0.97]"
            >
              Explore Stays
            </Link>
            <Link
              href="/events"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-sunset px-6 text-sm font-medium text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
