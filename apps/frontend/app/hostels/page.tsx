"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import HostelCard from "@/components/HostelCard";
import { useQuery } from "@apollo/client";
import { GET_HOSTELS } from "@/lib/queries";

type HostelSummary = {
  id: string;
  name?: string | null;
  tagline?: string | null;
  basePrice?: number | null;
  location?: { address?: { city?: string | null } | null } | null;
  images?: { thumbnail?: { url?: string | null } | null } | null;
};

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const roomTypes = [
  {
    id: "dorm",
    eyebrow: "For solo travellers",
    title: "Dorms — where solo becomes social",
    body: "Choose a bunk when you want an easy way into hostel life, shared stories, and plans made around the table.",
    cta: "Explore dorms",
  },
  {
    id: "couple",
    eyebrow: "For two",
    title: "Couple rooms — mountain mornings for two",
    body: "A private room for slower mornings and your own space, with the rest of the hostel close when you feel social.",
    cta: "Explore couple rooms",
  },
  {
    id: "suite",
    eyebrow: "For longer stays",
    title: "Suites — space to breathe, stay awhile",
    body: "More room for travellers who want to settle in, unpack properly, and make Vattakanal their base for a while.",
    cta: "Explore suites",
  },
];

type HostelCardData = {
  id: string;
  slug: string;
  name: string;
  location: string;
  tagline: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  isNew: boolean;
  isTrending: boolean;
  soldOut: boolean;
  bookedThisWeek: number;
  dostellerPrice?: number;
};

function HostelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState(searchParams?.get("category") || "all");
  const [query, setQuery] = useState(searchParams?.get("destination") || "");
  const [sortBy, setSortBy] = useState(searchParams?.get("sort") || "popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { data, loading, error } = useQuery<{ hostels: HostelSummary[] }>(GET_HOSTELS);

  const syncURL = useCallback((cat: string, q: string, sort: string) => {
    const params = new URLSearchParams();
    if (q) params.set("destination", q);
    if (cat && cat !== "all") params.set("category", cat);
    if (sort && sort !== "popular") params.set("sort", sort);
    router.replace(`/hostels?${params.toString()}`, { scroll: false });
  }, [router]);

  const hostels = useMemo<HostelCardData[]>(() => data?.hostels?.map((hostel) => {
    const name = hostel.name || "Dostel Hostel";

    return {
      id: hostel.id,
      slug: slugify(name),
      name,
      location: hostel.location?.address?.city || "Vattakanal",
      tagline: hostel.tagline || "A community hostel in the Kodaikanal mountains",
      price: hostel.basePrice || 0,
      rating: 0,
      reviewCount: 0,
      image: hostel.images?.thumbnail?.url || "/images/hostel-exterior.jpg",
      tags: [],
      isNew: false,
      isTrending: false,
      soldOut: false,
      bookedThisWeek: 0,
    };
  }) || [], [data]);

  const filtered = useMemo(() => {
    return hostels
      .filter((hostel) => {
        const matchCat = selected === "all" || hostel.tags.some((tag) => tag.toLowerCase() === selected);
        const matchQ = query === "" || hostel.name.toLowerCase().includes(query.toLowerCase()) || hostel.location.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQ;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });
  }, [selected, query, sortBy, hostels]);

  if (loading) return <div className="py-12">Loading hostels...</div>;
  if (error) return <div className="py-12">Error loading hostels</div>;

  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <div className="bg-forest-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">One hostel. Three ways to stay.</h1>
          <p className="mx-auto mt-4 max-w-3xl text-white/80">
            Dorms for solo wanderers. Couple rooms for quiet mornings. Suites for when you need space. All under one roof in Vattakanal.
          </p>
          <div className="mt-8 bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-3 items-center text-left">
              <div className="flex-1">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Pick your room type</p>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); syncURL(selected, e.target.value, sortBy); }}
                  placeholder="Dorm, couple room, or suite..."
                  className="w-full text-sm text-forest-900 outline-none placeholder-stone-400"
                />
              </div>
              <div className="w-px bg-stone-200 hidden sm:block h-10" />
              <div className="sm:w-40">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Check-in</p>
                <input type="date" className="w-full text-sm text-stone-400 outline-none" />
              </div>
              <div className="w-px bg-stone-200 hidden sm:block h-10" />
              <div className="sm:w-40">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Check-out</p>
                <input type="date" className="w-full text-sm text-stone-400 outline-none" />
              </div>
              <button className="px-6 py-3 bg-sunset text-white text-sm font-bold rounded-xl hover:brightness-95 whitespace-nowrap">
                Check availability
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide border-b border-stone-200 bg-white">
        <div className="flex gap-2 px-4 py-3 max-w-7xl mx-auto">
          {[
            { id: "all", label: "All", icon: "🏔️" },
            { id: "hostel", label: "Hostel", icon: "🏨" },
            { id: "coliving", label: "Co-living", icon: "🏢" },
            { id: "workation", label: "Workation", icon: "💻" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelected(cat.id); syncURL(cat.id, query, sortBy); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all shrink-0 ${
                selected === cat.id
                  ? "bg-forest-900 text-white border-forest-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <section className="border-b border-stone-200 bg-snow px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sunset">Choose how you stay</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-forest-900 md:text-4xl">Three room styles. One mountain home.</h2>
            <p className="mt-4 leading-7 text-stone-600">Start with the kind of space you want. Live room details and rates are shown when you check your dates.</p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 lg:grid-cols-3">
            {roomTypes.map((room, index) => (
              <article key={room.id} className="group relative bg-white p-7 sm:p-8">
                <span className="font-heading text-5xl text-forest-900/10">0{index + 1}</span>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-sunset">{room.eyebrow}</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-forest-900">{room.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-600">{room.body}</p>
                <Link href={`/hostels/dostel-vattakanal?room=${room.id}`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest-900 transition group-hover:text-sunset">
                  {room.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-forest-900">Explore {filtered.length} hostels</h2>
            <p className="mt-1 text-sm text-stone-500">Filtered by {selected === "all" ? "all categories" : selected}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-stone-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); syncURL(selected, query, e.target.value); }}
              className="border border-stone-200 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Rating: high to low</option>
            </select>
            <button
              onClick={() => setView(view === "grid" ? "list" : "grid")}
              className={`p-2 rounded-hover bg-stone-50 hover:bg-stone-100 ${view === "grid" ? "text-forest-600" : "text-stone-500"}`}
              aria-label={`${view === "grid" ? "List view" : "Grid view"}`}
            >
              {view === "grid" ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h12M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H3m8 4H3m-9 4h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((hostel) => (
                <HostelCard
                  key={hostel.id}
                  {...hostel}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((hostel) => (
                <HostelCard
                  key={hostel.id}
                  {...hostel}
                  variant="list"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HostelsPage() {
  return (
    <section>
      <Suspense fallback={<div className="py-12">Loading hostels...</div>}>
        <HostelsContent />
      </Suspense>
    </section>
  );
}
