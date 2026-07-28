import Image from "next/image";
import Link from "next/link";

const coliveProperties = [
  {
    slug: "dostel-colive-bangalore",
    name: "Dostel Colive, Bangalore",
    location: "Indiranagar, Bangalore",
    price: 12000,
    period: "month",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    features: ["Private Room", "All Meals", "High-speed WiFi", "Co-work Space", "Gym", "Community Events"],
    available: true,
  },
  {
    slug: "dostel-colive-goa",
    name: "Dostel Colive, Goa",
    location: "Assagao, North Goa",
    price: 15000,
    period: "month",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    features: ["Private Room", "Breakfast", "Pool Access", "Co-work Space", "Beach Trips", "Weekly BBQ"],
    available: true,
  },
  {
    slug: "dostel-colive-delhi",
    name: "Dostel Colive, Delhi",
    location: "Hauz Khas, New Delhi",
    price: 18000,
    period: "month",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    features: ["Private Room", "All Meals", "High-speed WiFi", "Co-work Space", "Gym", "Rooftop Lounge"],
    available: false,
  },
];

export default function ColivePage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[var(--color-brand-teal)] to-[var(--color-brand-success)] text-[var(--color-text-primary)] py-24 px-4 text-center">
        <span className="inline-block px-4 py-1.5 bg-[var(--color-surface)]/20 rounded-full text-sm font-medium mb-4">
          🏢 Coliving
        </span>
        <h1 className="heading-4xl font-playfair mb-4">
          Live with your tribe
        </h1>
        <p className="body-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Monthly coliving spaces with everything included — meals, WiFi, community and more.
          Meet amazing people while keeping your life flexible.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coliveProperties.map((prop) => (
            <div key={prop.slug} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-video bg-[var(--color-bg-muted)]">
                <Image
                  src={prop.image}
                  alt={prop.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {!prop.available && (
                  <div className="absolute inset-0 bg-[var(--color-bg-muted)]/50 flex items-center justify-center">
                    <span className="px-4 py-2 bg-[var(--color-surface)]/90 text-[var(--color-text-primary)] text-sm font-bold rounded-full">
                      Waitlist only
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="heading-lg font-playfair text-[var(--color-brand-primary)] leading-tight">
                    {prop.name}
                  </h3>
                  {prop.available && (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-[var(--color-success)]/20 text-[var(--color-success)] rounded-full shrink-0 ml-2">
                      Available
                    </span>
                  )}
                </div>
                <p className="text-[var(--color-text-muted)] text-sm mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {prop.location}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {prop.features.slice(0, 4).map((f) => (
                    <span key={f} className="px-2.5 py-1 text-xs font-medium bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] rounded-full">
                      {f}
                    </span>
                  ))}
                  {prop.features.length > 4 && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] rounded-full">
                      +{prop.features.length - 4} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[var(--color-brand-primary)]">
                      ₹{prop.price.toLocaleString()}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm">/{prop.period}</span>
                  </div>
                  <Link
                    href={prop.available ? `/colive/${prop.slug}` : "/colive/waitlist"}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      prop.available
                        ? "bg-[var(--color-brand-secondary)] text-white hover:bg-[var(--color-brand-primary)]/90"
                        : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] cursor-not-allowed"
                    }`}
                  >
                    {prop.available ? "Apply now" : "Join waitlist"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[var(--color-bg-muted)] rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="heading-2xl font-playfair text-[var(--color-brand-primary)] mb-4">
            Want to list your property?
          </h2>
          <p className="body-lg text-[var(--color-text-muted)] max-w-lg mx-auto mb-6">
            Partner with Dostel to offer your space as a coliving property and
            reach thousands of digital nomads.
          </p>
          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-secondary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-brand-primary)]/90 transition-colors"
          >
            List your property
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}