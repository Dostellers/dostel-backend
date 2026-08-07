"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TierCard from "@/components/TierCard";
import { dostellerTiers } from "@/lib/data";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTier = searchParams?.get("tier") || "bronze";
  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tier = dostellerTiers.find((t) => t.id === selectedTier);
  const isPaid = selectedTier !== "bronze";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all required fields"); return; }
    if (!agreed) { setError("Please accept the terms"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (isPaid) {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/dostellers" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-forest-500 mb-8 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dostellers
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-semibold text-forest-900 sm:text-4xl">Join Dostellers</h1>
          <p className="mt-2 text-stone-400">Select your tier and create your account</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row mb-10">
          {dostellerTiers.map((t) => (
            <TierCard key={t.id} tier={t} selected={selectedTier === t.id} onSelect={() => setSelectedTier(t.id)} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-forest-900 mb-1">Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-forest-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-sky" placeholder="Your name" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-forest-900 mb-1">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-forest-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-sky" placeholder="you@email.com" required />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-forest-900 mb-1">Phone {!isPaid && <span className="text-stone-400 font-normal">(optional)</span>}</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-forest-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-sky" placeholder="+91 98765 43210" required={isPaid} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-forest-900 mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-forest-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-sky" placeholder="Min. 8 characters" minLength={8} required />
            <p className="mt-1 text-xs text-stone-400">At least 8 characters</p>
          </div>

          {isPaid && (
            <div className="rounded-lg border border-sunset/30 bg-sunset/5 p-4">
              <p className="text-sm font-medium text-forest-900">Payment required for {tier?.name}</p>
              <p className="text-xs text-stone-400 mt-1">You&apos;ll be redirected to complete payment after account creation.</p>
            </div>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-stone-200 text-forest-500 accent-forest-500" />
            <span className="text-sm text-stone-600">I accept the terms of service and privacy policy</span>
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-forest-500 text-sm font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Creating account...
              </span>
            ) : isPaid ? `Create & pay ₹${tier?.price}` : "Create my Dosteller account"}
          </button>

          <p className="text-center text-sm text-stone-400">
            Already a member? <Link href="/login" className="text-forest-500 hover:text-forest-700 font-medium">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return <Suspense><JoinForm /></Suspense>;
}
