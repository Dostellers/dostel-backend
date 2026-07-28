"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HostelCard from "@/components/HostelCard";
import { hostels, categories } from "@/lib/data";

function HostelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState(searchParams.get("category") || "all");
  const [query, setQuery] = useState(searchParams.get("destination") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const syncURL = useCallback((cat: string, q: string, sort: string) => {
    const params = new URLSearchParams();
    if (q) params.set("destination", q);
    if (cat && cat !== "all") params.set("category", cat);
    if (sort && sort !== "popular") params.set("sort", sort);
    router.replace(`/hostels?${params.toString()}`, { scroll: false });
  }, [router]);

  const filtered = useMemo(() => {
    return hostels
      .filter((h) => {
        const matchCat = selected === "all" || h.category === selected || h.tags.some(t => t.toLowerCase() === selected);
        const matchQ = query === "" || h.name.toLowerCase().includes(query.toLowerCase()) || h.location.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQ;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [selected, query, sortBy]);

  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <div className="bg-forest-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Select your hostel</p>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); syncURL(selected, e.target.value, sortBy); }}
                  placeholder="Eg: Kasol, Goa, Jaipur..."
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
                Book now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide border-b border-stone-200 bg-white">
        <div className="flex gap-2 px-4 py-3 max-w-7xl mx-auto">
              {categories.map((cat) => (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-400 text-sm">
            <span className="font-bold text-forest-900">{filtered.length}</span> hostels found
          </p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); syncURL(selected, query, e.target.value); }}
              className="px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none bg-white"
            >
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
            </select>
            <div className="hidden sm:flex border border-stone-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-forest-900 text-white" : "hover:bg-stone-200/30"}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7z"/>
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-forest-900 text-white" : "hover:bg-stone-200/30"}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-bold text-forest-900">No hostels found</p>
            <p className="text-stone-400 mt-2 mb-4">Try a different search or category</p>
            <button onClick={() => { setQuery(""); setSelected("all"); syncURL("all", "", sortBy); }} className="px-5 py-2.5 text-sm font-bold text-white bg-sunset rounded-xl">
              Clear filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((h) => <HostelCard key={h.slug} {...h} reviewCount={h.reviews} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((h) => (
              <a key={h.slug} href={`/hostels/${h.slug}`} className="flex gap-4 border border-stone-200 rounded-2xl p-4 hover:shadow-md transition-shadow group">
                <div className="relative w-40 h-32 shrink-0 rounded-xl overflow-hidden bg-stone-200/30">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-stone-400 mb-0.5">{h.tagline}</p>
                  <h3 className="font-bold text-lg text-forest-900">{h.name}</h3>
                  <p className="text-sm text-stone-400">{h.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {h.tags.map(t => <span key={t} className="px-2 py-0.5 text-xs bg-stone-200/30 text-stone-600 rounded-full">{t}</span>)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-extrabold text-forest-900">₹{h.price}</p>
                  <p className="text-xs text-stone-400">/night</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <svg className="w-3.5 h-3.5 fill-sunset" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span className="text-sm font-bold">{h.rating}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HostelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-snow flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-forest-500 border-t-transparent animate-spin" /></div>}>
      <HostelsContent />
    </Suspense>
  );
}
