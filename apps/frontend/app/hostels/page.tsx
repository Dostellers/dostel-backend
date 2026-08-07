"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_HOSTELS } from "@/lib/queries";
import { hostels as localHostels } from "@/lib/data";
import { getProofConfig } from "@/lib/proof";
import Reveal from "@/components/Reveal";

/* The USP belongs at the decision point. A card that shows price and stars but
   no proof signal is indistinguishable from every OTA card ever shipped — and
   the honest low count ("2 of 6 measured") IS the brand, not a weakness. */
const proofMeta = (category: string) => {
  const pc = getProofConfig(category);
  return {
    total: pc.checks.length,
    measured: pc.checks.filter((c) => c.reading !== null).length,
  };
};

type HostelSummary = {
  id: string;
  name?: string | null;
  tagline?: string | null;
  basePrice?: number | null;
  location?: { address?: { city?: string | null } | null } | null;
  images?: { thumbnail?: { url?: string | null } | null } | null;
};

/* Terrain filters derived from the inventory we actually operate, not a
   hardcoded list. The previous version filtered against `tags: []`, which was
   always empty, so no category could ever match anything. */
const TERRAIN_LABEL: Record<string, string> = {
  mountains: "Mountains",
  beach: "Coast",
  city: "City",
  jungle: "Forest",
  heritage: "Old city",
  workation: "Work stay",
};

const SORTS = [
  { id: "popular", label: "Most reviewed" },
  { id: "rating", label: "Highest rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

function HostelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState(searchParams?.get("category") || "all");
  const [query, setQuery] = useState(searchParams?.get("destination") || "");
  const [sortBy, setSortBy] = useState(searchParams?.get("sort") || "popular");
  // "filter" is the navbar's Filling fast / Just opened contract.
  const [flag, setFlag] = useState(searchParams?.get("filter") || "");

  // Live data upgrades the local record in place. The API does not yet return
  // category, rating or review counts, so local stays the source for those —
  // mapping them to empty/0 is what silently broke filtering and sorting.
  const { data, error } = useQuery<{ hostels: HostelSummary[] }>(GET_HOSTELS);

  const network = useMemo(() => {
    const base = localHostels.filter((h) => h.slug.startsWith("dostel-"));
    return base.map((h) => {
      const live = data?.hostels?.find(
        (a) => (a.name || "").toLowerCase().trim() === h.name.toLowerCase().trim(),
      );
      return {
        ...h,
        price: live?.basePrice ?? h.price,
        tagline: live?.tagline || h.tagline,
      };
    });
  }, [data]);

  const syncURL = useCallback(
    (cat: string, q: string, sort: string, f: string) => {
      const params = new URLSearchParams();
      if (q) params.set("destination", q);
      if (cat && cat !== "all") params.set("category", cat);
      if (sort && sort !== "popular") params.set("sort", sort);
      if (f) params.set("filter", f);
      const qs = params.toString();
      router.replace(qs ? `/hostels?${qs}` : "/hostels", { scroll: false });
    },
    [router],
  );

  const terrains = useMemo(() => {
    const counts = new Map<string, number>();
    network.forEach((h) => counts.set(h.category, (counts.get(h.category) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [network]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return network
      .filter((h) => {
        const matchFlag =
          flag === "" || (flag === "trending" ? h.isTrending : flag === "new" ? h.isNew : true);
        const matchCat = selected === "all" || h.category === selected;
        const matchQ =
          q === "" ||
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q));
        return matchFlag && matchCat && matchQ;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [network, selected, query, sortBy, flag]);

  const cheapest = useMemo(
    () => (network.length ? Math.min(...network.map((h) => h.price)) : 0),
    [network],
  );

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <span className="stamp text-yellow-300">The network</span>
          <h1 className="mt-5 max-w-3xl text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
            {network.length} hostels. One standard.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
            Hills, coast and old cities. Every property publishes the same proof card —
            what was checked, when, and by what method.
          </p>

          <div className="mt-9 max-w-2xl">
            <label htmlFor="hostel-search" className="sr-only">
              Search by destination or hostel name
            </label>
            <div className="flex items-center gap-3 rounded-sm bg-white p-3">
              <svg className="ml-1 h-5 w-5 shrink-0 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="hostel-search"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  syncURL(selected, e.target.value, sortBy, flag);
                }}
                placeholder="Goa, Kodaikanal, Jaipur…"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-ink-1000 outline-none placeholder:text-ink-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 border-b border-ink-200 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="scrollbar-hide -mx-1 flex flex-1 gap-2 overflow-x-auto px-1">
            {[["all", `All ${network.length}`] as [string, string]].concat(
              terrains.map(([id, n]) => [id, `${TERRAIN_LABEL[id] || id} ${n}`] as [string, string]),
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => { setSelected(id); syncURL(id, query, sortBy, flag); }}
                aria-pressed={selected === id}
                className={`min-h-11 shrink-0 whitespace-nowrap rounded-sm border px-4 text-sm font-medium transition-colors duration-150 ${
                  selected === id
                    ? "border-coral-600 bg-coral-600 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
                }`}
              >
                {label}
              </button>
            ))}
            {[["trending", "Filling fast"], ["new", "Just opened"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  const next = flag === id ? "" : id;
                  setFlag(next); syncURL(selected, query, sortBy, next);
                }}
                aria-pressed={flag === id}
                className={`min-h-11 shrink-0 whitespace-nowrap rounded-sm border border-dashed px-4 text-sm font-medium transition-colors duration-150 ${
                  flag === id
                    ? "border-ink-1000 bg-ink-1000 text-white"
                    : "border-ink-300 bg-white text-ink-700 hover:border-ink-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="flex shrink-0 items-center gap-2 text-sm text-ink-600">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); syncURL(selected, query, e.target.value, flag); }}
              className="min-h-11 rounded-sm border border-ink-200 bg-white px-3 text-sm text-ink-1000"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="data text-xs uppercase tracking-[0.16em] text-ink-600" role="status">
            {filtered.length} {filtered.length === 1 ? "hostel" : "hostels"}
            {selected !== "all" && ` · ${TERRAIN_LABEL[selected] || selected}`}
            {flag && ` · ${flag === "trending" ? "filling fast" : "just opened"}`}
            {query && ` · “${query}”`}
          </p>
          <p className="data text-xs uppercase tracking-[0.16em] text-ink-500">
            From ₹{cheapest} a night
          </p>
        </div>

        {error && (
          <p className="mt-4 text-sm text-ink-600" role="status">
            Live rates are unavailable. Showing saved rates for the network.
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-sm border border-ink-200 bg-white p-10 text-center">
            <h2 className="text-xl text-ink-1000">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-md text-ink-700">
              We do not have a hostel matching that. The network is eight properties today
              and growing.
            </p>
            <button
              onClick={() => { setSelected("all"); setQuery(""); setFlag(""); syncURL("all", "", sortBy, ""); }}
              className="mt-6 inline-flex h-11 items-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-coral-700"
            >
              Show all {network.length}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h, i) => (
              <Reveal key={h.slug} delay={(i % 3) * 80}>
                <Link
                  href={`/hostels/${h.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="relative">
                    <div
                      className="aspect-[16/10] w-full bg-ink-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${h.image})` }}
                      role="presentation"
                    />
                    {h.isTrending && (
                      <span className="absolute left-0 top-4 bg-coral-600 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                        Filling fast
                      </span>
                    )}
                    {h.isNew && !h.isTrending && (
                      <span className="absolute left-0 top-4 bg-ink-1000 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                        Just opened
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="data text-[0.625rem] uppercase tracking-[0.18em] text-ink-500">
                        {TERRAIN_LABEL[h.category] || h.category}
                      </span>
                      <span className="shrink-0 text-xs text-ink-600">
                        <span className="font-semibold text-ink-900">{h.rating}</span>
                        {" · "}{h.reviews.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg leading-tight text-ink-1000">{h.name}</h2>
                    <p className="mt-1 text-sm text-ink-600">{h.location}</p>
                    <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-ink-700">
                      {h.tagline}
                    </p>

                    <p className="data mt-3 flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-600">
                      <svg className="h-3 w-3 shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m4 12.5 5 5L20 6.5" />
                      </svg>
                      Stay card · {proofMeta(h.category).measured} of {proofMeta(h.category).total} checks measured
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-2 border-t border-ink-200 pt-4">
                      <div>
                        <span className="data text-xl font-semibold text-ink-1000">₹{h.price}</span>
                        <span className="ml-1 text-xs text-ink-600">/ night</span>
                      </div>
                      <span className="tag">Dosteller ₹{Math.round(h.price * 0.9)}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function HostelsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <p className="data text-sm uppercase tracking-[0.18em] text-ink-600">Loading the network…</p>
        </div>
      }
    >
      <HostelsContent />
    </Suspense>
  );
}
