import Image from "next/image";
import Link from "next/link";
import HostelCard from "@/components/HostelCard";
import { hostels } from "@/lib/data";

const workationFeatures = [
  { icon: "⚡", title: "High-speed WiFi", desc: "Dedicated fiber connections for seamless video calls" },
  { icon: "🖥️", title: "Co-working Spaces", desc: "Professional desks, monitors and meeting rooms" },
  { icon: "☕", title: "Cafe & Community", desc: "Fuel your work with great coffee and conversations" },
  { icon: "🌄", title: "Work + Explore", desc: "Rejuvenate after work with curated local experiences" },
];

export default function WorkationsPage() {
  const workations = hostels.filter((h) => h.category === "workation" || h.tags.includes("Workation"));

  return (
    <div className="min-h-screen">
      <div className="relative bg-[var(--color-brand-teal)] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Co-working"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
            💻 Work from anywhere
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Workations built for you
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Escape your home office. Stay in beautiful destinations, work productively
            and build your tribe of fellow nomads.
          </p>
          <Link
            href="/hostels?filter=workation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-brand-lime)] text-gray-900 text-base font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Find a workation
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-12">
          Everything you need to do your best work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workationFeatures.map((feat) => (
            <div key={feat.title} className="p-6 bg-[var(--color-brand-light)] rounded-2xl">
              <span className="text-4xl">{feat.icon}</span>
              <h3 className="font-bold text-lg mt-4 mb-2 text-[var(--color-brand-primary)]">
                {feat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-primary)] mb-8">
          Top workation destinations
        </h2>
        {workations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workations.map((h) => (
              <HostelCard key={h.slug} {...h} reviewCount={h.reviews} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.slice(0, 3).map((h) => (
              <HostelCard key={h.slug} {...h} reviewCount={h.reviews} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
