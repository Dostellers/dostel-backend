"use client";

import { useState } from "react";
import Link from "next/link";

const hostelNav = [
  { label: "Trending", href: "/hostels?filter=trending" },
  { label: "New Launches", href: "/hostels?filter=new" },
  { label: "Mountain", href: "/hostels?cat=mountains" },
  { label: "Beach", href: "/hostels?cat=beach" },
  { label: "City", href: "/hostels?cat=city" },
  { label: "Workation", href: "/hostels?cat=workation" },
];

const destinationNav = [
  { label: "Kasol", href: "/destinations/kasol" },
  { label: "Goa", href: "/destinations/goa" },
  { label: "Manali", href: "/destinations/manali" },
  { label: "Jaipur", href: "/destinations/jaipur" },
  { label: "Coorg", href: "/destinations/coorg" },
  { label: "Dharamshala", href: "/destinations/dharamshala" },
];

const navItems: ({ label: string; href: string; dropdown?: undefined } | { label: string; dropdown: { label: string; href: string }[]; href?: undefined })[] = [
  { label: "Hostel", dropdown: hostelNav },
  { label: "Destination", dropdown: destinationNav },
  { label: "Workation", href: "/workations" },
  { label: "Colive", href: "/colive" },
  { label: "Dostellers", href: "/dostellers" },
  { label: "Event", href: "/events" },
];

const mobileNavItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Hostel", href: "/hostels", icon: "🛏️" },
  { label: "Dashboard", href: "/dashboard", icon: "📋" },
  { label: "Event", href: "/events", icon: "🎉" },
  { label: "Dostellers", href: "/dostellers", icon: "🏔️" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-500">
                <span className="text-lg font-extrabold text-white">D</span>
              </div>
              <span className="hidden text-2xl font-extrabold tracking-tight text-forest-900 sm:block">
                dostel
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50 hover:text-forest-900">
                      {item.label}
                      <svg className="h-3.5 w-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-stone-200 bg-white py-2 shadow-lg">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-stone-600 transition-colors duration-150 hover:bg-stone-200/50 hover:text-forest-900"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50 hover:text-forest-900"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/trips"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50 hover:text-forest-900"
                >
                  My Trips
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50 hover:text-forest-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-forest-500 transition-colors duration-150 hover:bg-forest-100 hover:text-forest-700"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-forest-500 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]"
                >
                  Sign up
                </Link>
              </div>
              <button
                className="rounded-lg p-2.5 transition-colors duration-150 hover:bg-stone-200/50 lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg className="h-5 w-5 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-stone-200 bg-white lg:hidden">
            <div className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50"
                      >
                        {item.label}
                        <svg className={`h-4 w-4 transition-transform duration-150 ${activeDropdown === item.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMenuOpen(false)}
                              className="block rounded-lg px-4 py-2 text-sm text-stone-500 transition-colors duration-150 hover:bg-stone-200/50"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="border-t border-stone-200 pt-4 mt-4 space-y-2">
                <Link
                  href="/trips"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50"
                >
                  My Trips
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50"
                >
                  Dashboard
                </Link>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-lg border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-200/50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-lg bg-forest-500 px-4 py-3 text-center text-sm font-medium text-white transition-all duration-150 hover:brightness-95"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white lg:hidden">
        <div className="grid h-16 grid-cols-5">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 text-stone-400 transition-colors duration-150 hover:text-forest-500"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}
