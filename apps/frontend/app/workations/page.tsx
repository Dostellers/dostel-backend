import Image from "next/image";
import Link from "next/link";

const workationFeatures = [
  {
    icon: "⚡",
    title: 'Real WiFi, not "WiFi"',
    desc: "Dedicated fiber connections for Zoom calls, uploads, and late-night coding sessions.",
  },
  {
    icon: "🖥️",
    title: "A desk that's actually comfortable",
    desc: "Co-work spaces with monitors, ergonomic chairs, and meeting room access.",
  },
  {
    icon: "☕",
    title: "Coffee that fuels more than caffeine",
    desc: "On-site cafe where Dostellers gather, debate, and plan the next trek.",
  },
  {
    icon: "🌄",
    title: "Work ends when the trail begins",
    desc: "Sunset hikes, waterfall swims, bonfire chats — because burnout is not a benefit.",
  },
];

const workationDestinations = [
  {
    name: "Vattakanal, Kodaikanal",
    bestFor: "Deep work + mountain community",
    price: "From ₹327/night (dorm) / ₹999/night (private)",
    tagline: "Mist, coffee, and a desk with a view",
    href: "/hostels/dostel-kasol-parvati-valley",
  },
  {
    name: "Bangalore, HSR Layout",
    bestFor: "City energy + startup crowd",
    price: "From ₹519/night",
    tagline: "Work, wander, repeat",
    href: "/hostels/dostel-bangalore-hsr",
  },
  {
    name: "Coorg, Madikeri",
    bestFor: "Plantation silence + forest walks",
    price: "From ₹589/night",
    tagline: "Coffee breaks at the source",
    href: "/hostels/dostel-coorg-rainforest",
  },
];

export default function WorkationsPage() {
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
            💻 Remote work, mountain life
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Your commute just got greener
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            High-speed WiFi, co-work spaces, and trails for lunch breaks. Dostel workations
            are built for remote workers who want productivity by day and community by night.
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
          Everything you need to do your best work (and live a little)
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
          Where do you want to work from this month?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workationDestinations.map((destination, index) => (
            <Link
              key={destination.name}
              href={destination.href}
              className={`block rounded-2xl border p-6 transition-transform hover:-translate-y-1 ${
                index === 0
                  ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-light)]"
                  : "border-gray-200 bg-white"
              }`}
            >
              {index === 0 && (
                <span className="inline-block rounded-full bg-[var(--color-brand-teal)] px-3 py-1 text-xs font-bold text-white mb-4">
                  Primary destination
                </span>
              )}
              <h3 className="text-xl font-bold text-[var(--color-brand-primary)]">
                {destination.name}
              </h3>
              <p className="mt-3 text-sm font-medium text-gray-700">
                ⭐ Best for: {destination.bestFor}
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--color-brand-teal)]">
                {destination.price}
              </p>
              <p className="mt-4 text-gray-500">“{destination.tagline}”</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-brand-primary)] px-4 py-16 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold">Try a week. Stay a month.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          The first week is on us if you&apos;re not productive — but most people never want to leave.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/hostels?filter=workation"
            className="inline-flex justify-center rounded-xl bg-[var(--color-brand-lime)] px-8 py-4 font-bold text-gray-900 hover:opacity-90 transition-opacity"
          >
            Find your workation
          </Link>
          <Link
            href="mailto:hello@dostel.in"
            className="inline-flex justify-center rounded-xl border border-white/40 px-8 py-4 font-bold text-white hover:bg-white/10 transition-colors"
          >
            Talk to a Dosteller
          </Link>
        </div>
      </div>
    </div>
  );
}
