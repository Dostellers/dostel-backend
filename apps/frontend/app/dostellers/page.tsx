"use client";
import { useState } from "react";
import Link from "next/link";
import TierCard from "@/components/TierCard";
import { dostellerTiers, dostellerTestimonials, dostellerEvents } from "@/lib/data";

export default function DostellersPage() {
  const [selectedTier, setSelectedTier] = useState("bronze");

  return (
    <div className="min-h-screen bg-snow">
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-900 to-forest-700 px-4 py-24 text-center text-white sm:py-32">
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm mb-6">
            🏔️ Built for long stays
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Stay longer.
            <br />
            <span className="text-sunset">Go deeper.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">
            Dostellers isn&apos;t a loyalty program — it&apos;s a community. Save up to 40% on long stays, unlock events, and connect with travellers who stay.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dostellers/join"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-sunset px-8 text-sm font-semibold text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
            >
              Join Dostellers — Free
            </Link>
            <a
              href="#tiers"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20 active:scale-[0.97]"
            >
              See membership plans
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: "💰", title: "Save up to 40%", desc: "On weekly & monthly stays" },
            { icon: "🎉", title: "Free events", desc: "Trekking, workshops & more" },
            { icon: "👥", title: "Community", desc: "Find your travel tribe" },
            { icon: "⭐", title: "Earn rewards", desc: "Points → free nights" },
          ].map((b) => (
            <div key={b.title} className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm border border-stone-200">
              <span className="text-3xl mb-2">{b.icon}</span>
              <h3 className="text-sm font-semibold text-forest-900">{b.title}</h3>
              <p className="text-xs text-stone-400 mt-0.5">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tiers" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-semibold text-forest-900 sm:text-4xl">Choose your membership</h2>
          <p className="mt-2 text-stone-400">Start free. Upgrade when you&apos;re ready to go deeper.</p>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          {dostellerTiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              selected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/dostellers/join?tier=${selectedTier}`}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-forest-500 px-10 text-sm font-semibold text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
          >
            {selectedTier === "bronze" ? "Join Dostellers — Free" : `Join as ${selectedTier === "silver" ? "Silver" : "Gold"} — ₹${selectedTier === "silver" ? "999" : "2499"}/yr`}
          </Link>
        </div>
      </section>

      <section className="bg-stone-200/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold text-forest-900 text-center mb-10">Real Dostellers, real stories</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dostellerTestimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-stone-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.location} · {t.tier} member</p>
                  </div>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold text-forest-900 text-center mb-10">Member events</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {dostellerEvents.map((e) => (
            <div key={e.slug} className="group rounded-xl border border-stone-200 bg-white overflow-hidden transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
              <div className="aspect-[16/9] relative overflow-hidden bg-stone-100">
                <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-forest-900">{e.title}</h3>
                <p className="text-xs text-stone-400">{e.date} · {e.location}</p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-sm font-bold text-forest-500">₹{e.memberPrice}</span>
                    {e.regularPrice > 0 && <span className="text-xs text-stone-400 line-through ml-1.5">₹{e.regularPrice}</span>}
                    <p className="text-[10px] text-stone-400">Member price</p>
                  </div>
                  <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-[10px] font-medium text-forest-700">
                    {e.spotsLeft} left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest-900 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl mb-4">Ready to become a Dosteller?</h2>
          <p className="text-white/80 mb-8">Join 2,000+ travellers who&apos;ve made Dostel their home away from home.</p>
          <Link
            href="/dostellers/join"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-sunset px-10 text-sm font-semibold text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
          >
            Join Dostellers — Free
          </Link>
        </div>
      </section>
    </div>
  );
}
