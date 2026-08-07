"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* The listing reads ?category= and ?filter= — these hrefs are a contract with
   app/hostels/page.tsx, not decoration. The old menu sent ?cat= (read by
   nothing) and advertised Kasol/Manali, where the network has no beds. */
const hostelNav = [
  { label: "Filling fast", href: "/hostels?filter=trending" },
  { label: "Just opened", href: "/hostels?filter=new" },
  { label: "Mountains", href: "/hostels?category=mountains" },
  { label: "Coast", href: "/hostels?category=beach" },
  { label: "City", href: "/hostels?category=city" },
  { label: "Work stay", href: "/hostels?category=workation" },
];

const destinationNav = [
  { label: "Kodaikanal", href: "/destinations/kodaikanal" },
  { label: "Dharamshala", href: "/destinations/dharamshala" },
  { label: "Goa", href: "/destinations/goa" },
  { label: "Gokarna", href: "/destinations/gokarna" },
  { label: "Coorg", href: "/destinations/coorg" },
  { label: "Jaipur", href: "/destinations/jaipur" },
  { label: "Delhi", href: "/destinations/delhi" },
  { label: "Bangalore", href: "/destinations/bangalore" },
];

const navItems: ({ label: string; href: string; dropdown?: undefined } | { label: string; dropdown: { label: string; href: string }[]; href?: undefined })[] = [
  { label: "Hostel", dropdown: hostelNav },
  { label: "Destination", dropdown: destinationNav },
  { label: "Workation", href: "/workations" },
  { label: "Colive", href: "/colive" },
  { label: "Dostellers", href: "/dostellers" },
  { label: "Event", href: "/events" },
];

/* 2px stroke, currentColor, 24px grid — replaces the emoji row.
   Emoji render differently on every OS and are announced as their unicode
   name by screen readers, so they were never icons to begin with. */
const icons = {
  home: "M4 11.5 12 4l8 7.5M6.5 10v9h11v-9",
  bed: "M3 7v12M3 12h18v7M21 12v-1a3 3 0 0 0-3-3h-6v4M7.5 11.5h.01",
  trips: "M8 4h8a1 1 0 0 1 1 1v15l-5-3-5 3V5a1 1 0 0 1 1-1z",
  event: "M4 8h16M7 4v3M17 4v3M5 8h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z",
  peak: "m3 18 6-9 4 5.5L15.5 11 21 18z",
} as const;

const mobileNavItems = [
  { label: "Home", href: "/", icon: icons.home },
  { label: "Hostel", href: "/hostels", icon: icons.bed },
  { label: "Trips", href: "/trips", icon: icons.trips },
  { label: "Event", href: "/events", icon: icons.event },
  { label: "Dostellers", href: "/dostellers", icon: icons.peak },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname() ?? "/";

  const linkBase =
    "rounded-sm px-3 py-2 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-1000";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink-200 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-coral-600 text-lg font-extrabold text-white">
                D
              </span>
              <span className="hidden leading-none sm:block">
                <span className="block text-xl font-extrabold tracking-[-0.03em] text-ink-1000">dostel</span>
                <span
                  className="block text-[0.6875rem] text-ink-500"
                  style={{ fontFamily: "var(--font-deva)" }}
                >
                  दोस्त + hostel
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className={`flex items-center gap-1.5 ${linkBase}`}>
                      {item.label}
                      <svg className="h-3.5 w-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute left-0 top-full w-52 rounded-sm border border-ink-200 bg-white py-2 shadow-[0_18px_40px_-24px_rgba(11,11,12,0.5)]">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-ink-700 transition-colors duration-150 hover:bg-coral-50 hover:text-coral-800"
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
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`${linkBase} ${pathname === item.href ? "bg-coral-50 text-coral-800" : ""}`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 md:flex">
                <Link href="/trips" className={linkBase}>My Trips</Link>
                <Link href="/dashboard" className={linkBase}>Dashboard</Link>
                <Link
                  href="/auth/login"
                  className="rounded-sm px-3 py-2 text-sm font-semibold text-coral-700 transition-colors duration-150 hover:bg-coral-50"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-sm bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-700 active:scale-[0.97]"
                >
                  Sign up
                </Link>
              </div>
              <button
                className="rounded-sm p-2.5 transition-colors duration-150 hover:bg-ink-100 lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <svg className="h-5 w-5 text-ink-1000" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-ink-200 bg-white lg:hidden">
            <div className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        aria-expanded={activeDropdown === item.label}
                        className="flex min-h-11 w-full items-center justify-between rounded-sm px-4 py-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
                      >
                        {item.label}
                        <svg className={`h-4 w-4 transition-transform duration-150 ${activeDropdown === item.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
                              className="block min-h-11 rounded-sm px-4 py-2.5 text-sm text-ink-600 transition-colors duration-150 hover:bg-coral-50"
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
                      className="block min-h-11 rounded-sm px-4 py-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="mt-4 space-y-2 border-t border-ink-200 pt-4">
                <Link href="/trips" onClick={() => setMenuOpen(false)} className="block min-h-11 rounded-sm px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-100">My Trips</Link>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block min-h-11 rounded-sm px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-100">Dashboard</Link>
                <div className="flex gap-3 pt-2">
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="flex-1 rounded-sm border border-ink-200 px-4 py-3 text-center text-sm font-semibold text-ink-700 hover:bg-ink-100">Log in</Link>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="flex-1 rounded-sm bg-coral-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-coral-700">Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-200 bg-paper lg:hidden" aria-label="Primary">
        <div className="grid h-16 grid-cols-5">
          {mobileNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                  active ? "text-coral-700" : "text-ink-500 hover:text-coral-700"
                }`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={item.icon} />
                </svg>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}
