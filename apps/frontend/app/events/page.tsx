"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { events } from "@/lib/data";

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("date-asc");

  const categories = [
    { label: "All", value: "all" },
    { label: "Music", value: "music" },
    { label: "Art", value: "art" },
    { label: "Workshop", value: "workshop" },
    { label: "Food", value: "food" },
    { label: "Adventure", value: "adventure" },
  ];

  const sortOptions = [
    { label: "Date: Newest", value: "date-desc" },
    { label: "Date: Oldest", value: "date-asc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Popularity", value: "popularity" },
  ];

  const filtered = events
    .filter(
      (e) =>
        (selectedCat === "all" || e.category === selectedCat) &&
        (query === "" ||
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.description.toLowerCase().includes(query.toLowerCase())) &&
        (location === "" || e.location.toLowerCase().includes(location.toLowerCase())) &&
        (date === "" || e.date.includes(date))
    )
    .sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "popularity") return Number(b.spotsLeft) - Number(a.spotsLeft);
      return 0;
    });

  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      {/* Header */}
      <section className="bg-[var(--color-brand-primary)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="heading-2xl text-[var(--color-brand-primary)] mb-4">
              Discover<br /><span className="block">Unforgettable Experiences</span>
            </h1>
            <p className="body-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
              Explore handpicked events across music, art, food, adventure and more
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <SearchBar
              dark
              placeholder="Search events, artists, venues..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
            
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                Location
              </label>
              <input
                type="text"
                placeholder="City, area or venue"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                Category
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="select w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3 mb-4 lg:mb-0">
              <button
                onClick={() => {
                  setQuery("");
                  setLocation("");
                  setDate("");
                  setSelectedCat("all");
                }}
                className="btn btn-outline btn-sm"
              >
                Clear filters
              </button>
              <button
                onClick={() => {
                  setQuery("");
                  setLocation("");
                  setDate("");
                  setSelectedCat("all");
                  setSortBy("date-asc");
                }}
                className="btn btn-primary btn-sm"
              >
                Sort by: {sortOptions.find((o) => o.value === sortBy)?.label}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <span className="text-[var(--color-text-muted)] text-sm">
                Showing {filtered.length} of {events.length} events
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-16 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--color-text-muted)] text-lg mb-6">
                No events match your filters. Try adjusting your search.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => {
                    setQuery("");
                    setLocation("");
                    setDate("");
                    setSelectedCat("all");
                  }}
                  className="btn btn-outline"
                >
                  Clear all filters
                </button>
                <button className="btn btn-primary">Explore all events</button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((event) => (
                  <Link
                    key={event.slug}
                    href={`/events/${event.slug}`}
                    className="group block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative aspect-[16/9] bg-[var(--color-bg-muted)]">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 text-xs font-medium bg-[var(--color-brand-secondary)] text-white rounded-full">
                          {event.categoryLabel}
                        </span>
                      </div>
                      
                      {event.spotsLeft < 15 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 text-xs font-medium bg-amber-400 text-gray-900 rounded-full">
                            {event.spotsLeft} spots left!
                          </span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[var(--color-text-primary)] font-bold text-xl leading-tight">
                          {event.title}
                        </p>
                        <p className="text-[var(--color-text-muted)] text-sm">
                          {event.date} · {event.location}
                        </p>
                        <p className="text-[var(--color-text-muted)] text-xs mt-0.5">
                          {event.duration}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 mb-4">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-[var(--color-brand-primary)] font-bold text-xl">
                            ₹{event.price.toLocaleString()}
                          </p>
                          <p className="text-[var(--color-text-muted)] text-xs line-through">
                            ₹{event.originalPrice.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className="px-4 py-2 bg-[var(--color-brand-secondary)] text-white text-sm font-medium rounded-hover hover:opacity-90 transition-opacity"
                        >
                          Book now
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--color-brand-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="heading-lg text-white mb-6">
            Host your own event with Dostel
          </h2>
          <p className="body-lg text-white/80 mb-8 max-w-xl mx-auto">
            From intimate gatherings to large festivals, we help you create unforgettable experiences
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/list-event"
              className="btn btn-outline btn-lg hover:bg-[var(--color-brand-primary)]/20 hover:text-white"
            >
              List your event
            </Link>
            <Link
              href="/organizer"
              className="btn btn-primary btn-lg"
            >
              Organizer resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}