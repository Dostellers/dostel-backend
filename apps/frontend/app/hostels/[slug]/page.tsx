"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { hostels, hostelRooms, hostelFAQs, hostelPolicies, hostelWhyLove, amenitiesList, blogPosts, hostelImages } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";
import FAQAccordion from "@/components/FAQAccordion";
import HostelCard from "@/components/HostelCard";
import PolicyPills from "@/components/PolicyPills";
import SocialProof from "@/components/SocialProof";
import StickyBottomBar from "@/components/StickyBottomBar";
import LongStayToggle from "@/components/LongStayToggle";
import { useBooking } from "@/components/BookingProvider";

const TIMINGS = [
  { icon: "🔑", label: "Check-in", value: "2 PM" },
  { icon: "🚪", label: "Check-out", value: "11 AM" },
  { icon: "👥", label: "Guest visit", value: "10 AM – 8 PM" },
  { icon: "🏨", label: "Reception", value: "24 Hrs" },
  { icon: "☕", label: "Breakfast", value: "8 AM – 12 PM" },
  { icon: "🍽️", label: "Lunch", value: "12 PM – 3 PM" },
  { icon: "🌙", label: "Dinner", value: "6 PM – 1 AM" },
  { icon: "🌊", label: "Common area", value: "24 Hrs" },
  { icon: "🚿", label: "Hot water", value: "24 Hrs" },
  { icon: "📞", label: "Customer support", value: "10 AM – 10 PM" },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default function HostelDetailPage({ params }: Props) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const { state, actions } = useBooking();

  const hostel = hostels.find((h) => h.slug === slug);
  if (!hostel) notFound();

  const images = hostelImages[slug as keyof typeof hostelImages] ?? hostelImages.default;
  const similar = hostels.filter((h) => h.slug !== slug && h.category === hostel.category).slice(0, 4);
  const moreHostels = similar.length < 4 ? [...similar, ...hostels.filter(h => h.slug !== slug).slice(0, 4 - similar.length)] : similar;

  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [longStay, setLongStay] = useState(false);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);
  const showLongStay = nights >= 7;

  const toggleRoom = (roomId: string) => {
    const next = new Set(selectedRooms);
    if (next.has(roomId)) {
      next.delete(roomId);
    } else {
      next.add(roomId);
    }
    setSelectedRooms(next);
  };

  const totalPrice = useMemo(() => {
    return hostelRooms
      .filter((r) => selectedRooms.has(r.id))
      .reduce((sum, r) => sum + r.price * nights, 0);
  }, [selectedRooms, nights]);

  const lowestPrice = hostelRooms.reduce((min, r) => Math.min(min, r.price), Infinity);

  const goToBooking = () => {
    if (selectedRooms.size === 0) return;
    const roomData = hostelRooms.filter((r) => selectedRooms.has(r.id));
    actions.updateSearch({ checkIn, checkOut });
    actions.setHostel({ slug, name: hostel.name, location: hostel.location });
    roomData.forEach((r) => {
      actions.selectRoom({
        roomId: r.id,
        name: r.name,
        quantity: 1,
        pricePerNight: r.price,
        total: r.price * nights,
      });
    });
    window.location.href = `/booking/${slug}/details?checkIn=${checkIn}&checkOut=${checkOut}`;
  };

  return (
    <div className="min-h-screen bg-snow text-stone-600 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <GalleryGrid images={images} name={hostel.name} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                {hostel.tags?.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-stone-200/50 px-3 py-1.5 text-xs font-medium text-stone-400 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-forest-900 mb-4 leading-tight">
                Dostel<br /><span className="block">{hostel.name}</span>
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(hostel.rating) ? "text-sunset" : "text-stone-200"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-forest-900">{hostel.rating}</span>
                  <span className="text-sm text-stone-400">({hostel.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-stone-600 mb-6">{hostel.description}</p>

              <PolicyPills policies={["Free cancel 48h", "Check-in 2PM", "ID required"]} />
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                Amenities
              </h2>
              <div className="overflow-hidden">
                <div className="animate-marquee flex gap-6 py-4">
                  {[...amenitiesList, ...amenitiesList, ...amenitiesList].map((a, i) => (
                    <div key={i} className="flex flex-col items-center gap-2.5 px-4 py-3 bg-white rounded-2xl mx-2 min-w-[80px] border border-stone-200">
                      <span className="text-3xl">{a.icon}</span>
                      <span className="text-sm font-medium text-stone-400 whitespace-nowrap">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="rooms">
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                Rooms
              </h2>
              {showLongStay && (
                <div className="mb-6">
                  <LongStayToggle
                    onToggle={setLongStay}
                    active={longStay}
                    isDosteller={false}
                  />
                </div>
              )}
              <div className="space-y-4">
                {hostelRooms.map((room) => {
                  const isSelected = selectedRooms.has(room.id);
                  return (
                    <div
                      key={room.id}
                      className={`rounded-2xl border-2 bg-white overflow-hidden transition-all duration-250 ${
                        isSelected
                          ? "border-forest-500 shadow-md"
                          : room.available
                            ? "border-stone-200 hover:border-forest-500/40"
                            : "border-stone-200 opacity-60"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4">
                        <div className="sm:col-span-4">
                          <Image src={room.image} alt={room.name} width={400} height={300} className="h-36 w-full object-cover rounded-xl" />
                        </div>
                        <div className="sm:col-span-8 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-heading text-lg font-semibold text-forest-900">{room.name}</h3>
                              <p className="text-sm text-stone-400">Up to {room.capacity} guests</p>
                            </div>
                            <div className="text-right">
                              <p className="font-heading text-xl font-extrabold text-forest-900">₹{longStay ? Math.round(room.price * 0.8) : room.price}</p>
                              {room.originalPrice && (
                                <p className="text-xs text-stone-400 line-through">₹{room.originalPrice}</p>
                              )}
                              <p className="text-xs text-stone-400">/night</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.slice(0, 5).map((a) => (
                              <span key={a} className="rounded-full bg-stone-200/50 px-2.5 py-0.5 text-xs font-medium text-stone-400">
                                {a}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <SocialProof count={(room as any).bookedThisWeek || 0} label="booked this week" />
                            <button
                              onClick={() => toggleRoom(room.id)}
                              disabled={!room.available}
                              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-sky ${
                                isSelected
                                  ? "bg-forest-500 text-white"
                                  : room.available
                                    ? "border-2 border-forest-500 text-forest-500 hover:bg-forest-50"
                                    : "bg-stone-200/50 text-stone-400 cursor-not-allowed"
                              }`}
                            >
                              {!room.available ? "Sold out" : isSelected ? "Selected" : "Select"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                Why you&apos;ll love it here
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostelWhyLove.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-stone-200/30 p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl shrink-0">{item.icon}</span>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-forest-900 mb-2">{item.title}</h3>
                        <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                Location
              </h2>
              <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">🚂</span>
                    <div>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">From the train station</p>
                      <p className="text-forest-900">{hostel.nearbyTrain}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">🚌</span>
                    <div>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">From the bus stand</p>
                      <p className="text-forest-900">{hostel.nearbyBus}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">✈️</span>
                    <div>
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">From the airport</p>
                      <p className="text-forest-900">{hostel.nearbyAirport}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                Important information
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-forest-900 mb-4 uppercase tracking-wider">Important timings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TIMINGS.map((t) => (
                      <div key={t.label} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4">
                        <span className="text-2xl shrink-0">{t.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-stone-400">{t.label}</p>
                          <p className="font-semibold text-forest-900">{t.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-forest-900 mb-4 uppercase tracking-wider">General information</h3>
                  <ul className="space-y-3">
                    {hostelPolicies.slice(0, 5).map((p, i) => (
                      <li key={i} className="flex items-start gap-3 text-stone-600">
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-sunset" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                FAQs
              </h2>
              <FAQAccordion faqs={hostelFAQs} />
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-forest-900 mb-6 uppercase tracking-wider">
                Policies
              </h2>
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-semibold text-forest-900 mb-4 uppercase tracking-wider">General policies</h3>
                <ul className="space-y-4">
                  {hostelPolicies.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-600">
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-stone-200" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-8">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-lg">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-forest-900">
                    ₹{selectedRooms.size > 0 ? Math.round(totalPrice / Math.max(1, nights)) : (hostel.price || lowestPrice)}
                  </span>
                  <span className="text-sm text-stone-400">/night</span>
                </div>
                <p className="text-sm text-stone-400 mb-5">Free cancellation available</p>
                <div className="mb-6 overflow-hidden rounded-xl border border-stone-200">
                  <div className="grid grid-cols-2 divide-x divide-stone-200">
                    <div className="p-4">
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Check-in</p>
                      <p className="mt-2 font-semibold text-forest-900">{checkIn || "Select dates"}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Check-out</p>
                      <p className="mt-2 font-semibold text-forest-900">{checkOut || "Select dates"}</p>
                    </div>
                  </div>
                  <div className="border-t border-stone-200 p-4">
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Duration</p>
                    <p className="mt-2 font-semibold text-forest-900">{nights} {nights === 1 ? "Night" : "Nights"}</p>
                  </div>
                </div>
                <button
                  onClick={goToBooking}
                  disabled={selectedRooms.size === 0}
                  className="w-full rounded-xl bg-sunset px-5 py-3 text-sm font-extrabold text-white uppercase tracking-wider transition-all duration-150 active:scale-[0.97] hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {selectedRooms.size === 0 ? "Select a room" : `Book now · ₹${totalPrice}`}
                </button>
                <p className="mt-4 text-center text-xs text-stone-400">No booking fees · Instant confirmation</p>
              </div>

              <div className="rounded-2xl bg-stone-200/30 p-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">📞</span>
                  <div>
                    <p className="text-sm text-stone-400">Need help? Call us</p>
                    <p className="font-semibold text-forest-900">+91 98101 87717</p>
                    <p className="text-sm text-stone-400">10 AM – 10 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <StickyBottomBar
        price={selectedRooms.size > 0 ? Math.round(totalPrice / Math.max(1, nights)) : (hostel.price || lowestPrice)}
        total={totalPrice}
        ctaLabel={selectedRooms.size === 0 ? "Select a room" : `Book now · ₹${totalPrice}`}
        disabled={selectedRooms.size === 0}
        onCtaClick={goToBooking}
        show
      />

      {moreHostels.length > 0 && (
        <div className="bg-stone-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900 mb-8 uppercase tracking-wider">
              Similar properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreHostels.slice(0, 4).map((h: any) => (
                <HostelCard key={h.slug} {...h} reviewCount={h.reviews} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-forest-900 mb-8 uppercase tracking-wider">
            Must reads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-2xl border border-stone-200 bg-white overflow-hidden hover:shadow-md transition-all duration-250 hover:-translate-y-0.5">
                <div className="relative aspect-video">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-stone-400">
                    {post.readTime}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-stone-400">{post.date}</p>
                  <h3 className="font-heading text-lg font-semibold text-forest-900 line-clamp-2 group-hover:text-sunset transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-stone-600 line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}