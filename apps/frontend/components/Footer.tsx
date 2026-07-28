import Link from "next/link";
import { PhoneIcon } from "./Icons";

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

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/dostel", icon: "📸" },
  { label: "YouTube", href: "https://youtube.com", icon: "📺" },
  { label: "Twitter", href: "https://twitter.com", icon: "🐦" },
  { label: "Facebook", href: "https://facebook.com", icon: "👍" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "💼" },
  { label: "Threads", href: "https://threads.net", icon: "🧵" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brand-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-brand-secondary)] rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">D</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight">dostel</span>
          </Link>
          <div className="flex gap-4 flex-wrap">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[var(--color-brand-secondary)]/20 transition-all duration-300 transform hover:scale-[1.05] text-lg"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-12">
          <div className="grid gap-8 md:grid-cols-4">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-6">
                  {section}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {section === "Contact details" && (
                    <li className="mt-4 flex items-center gap-3">
                      <PhoneIcon className="h-6 w-6 text-gray-300" />
                      <div>
                        <a href="tel:+919810187717" className="block text-gray-300 hover:text-white transition-colors duration-200">
                          +919810187717
                        </a>
                        <p className="text-gray-500 text-xs mt-1">(Timing: 10AM – 10PM)</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            Dostel Hospitality Private Limited · © 2025 All Rights Reserved
          </p>
          <div className="flex items-center gap-6">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Our brands</p>
            <div className="flex gap-4">
              {["glu", "unbox", "bam"].map((brand) => (
                <span key={brand} className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
