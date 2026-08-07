import Link from "next/link";

const footerLinks = {
  Accommodations: [
    { label: "Destinations", href: "/destinations" },
    { label: "Hostel", href: "/hostels" },
    { label: "Workation", href: "/workations" },
    { label: "Colive", href: "/colive" },
  ],
  "Important links": [
    { label: "Career", href: "https://linkedin.com" },
    { label: "Developers & owners", href: "/list-property" },
    { label: "Influencer", href: "/influencer" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Media", href: "/press" },
  ],
  Policies: [
    { label: "Guest policy", href: "/policies" },
    { label: "Privacy policy", href: "/privacy" },
  ],
  "Contact details": [
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "B2B partners", href: "/btob" },
  ],
};

/* Real brand glyphs at 24px. Replaces the emoji row, which rendered
   differently on every platform and announced as "camera with flash". */
const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/dostel", path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z" },
  { label: "YouTube", href: "https://youtube.com", path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" },
  { label: "X", href: "https://twitter.com", path: "M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.5 3h6.3l4.4 5.8zm-1.1 16.1h1.7L7.7 4.8H5.9z" },
  { label: "Facebook", href: "https://facebook.com", path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" },
  { label: "LinkedIn", href: "https://linkedin.com", path: "M6.9 21H3.3V9.2h3.6zM5.1 7.6a2.1 2.1 0 1 1 2.1-2.1 2.1 2.1 0 0 1-2.1 2.1zM21 21h-3.6v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H9.7V9.2h3.4v1.6a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5z" },
];

export default function Footer() {
  return (
    <footer className="bg-ink-1000 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-coral-600 text-lg font-extrabold text-white">
              D
            </span>
            <span className="leading-none">
              <span className="block text-2xl font-extrabold tracking-[-0.03em]">dostel</span>
              <span className="block text-xs text-white/45" style={{ fontFamily: "var(--font-deva)" }}>
                दोस्त + hostel
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/8 text-white/70 transition-colors duration-150 hover:bg-coral-600 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="data mb-5 text-[0.6875rem] uppercase tracking-[0.2em] text-white/40">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-150 hover:text-yellow-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {heading === "Contact details" && (
                <a
                  href="tel:+919810187717"
                  className="mt-5 flex items-center gap-2.5 text-sm text-white/70 transition-colors duration-150 hover:text-yellow-300"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.9z" />
                  </svg>
                  <span>
                    +91 98101 87717
                    <span className="block text-xs text-white/40">10 AM – 10 PM</span>
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/45">
            Dostel Hospitality Private Limited · © 2026
          </p>
          <div className="flex items-center gap-5">
            <span className="data text-[0.6875rem] uppercase tracking-[0.2em] text-white/30">Our brands</span>
            <div className="flex gap-4">
              {["glu", "unbox", "bam"].map((b) => (
                <span key={b} className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/40">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
