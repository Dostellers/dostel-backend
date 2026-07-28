import Link from "next/link";

const plans = [
  {
    name: "Explorer",
    price: 999,
    period: "month",
    color: "from-[var(--color-brand-primary)] to-[var(--color-brand-teal)]",
    features: [
      "5% discount on all bookings",
      "Priority check-in at 50+ hostels",
      "Free breakfast twice a month",
      "Access to member events",
      "24/7 concierge support",
    ],
    cta: "Get Explorer",
    popular: false,
  },
  {
    name: "Nomad",
    price: 1999,
    period: "month",
    color: "from-[var(--color-brand-secondary)] to-[var(--color-accent)]",
    features: [
      "10% discount on all bookings",
      "Priority check-in at all hostels",
      "Free breakfast daily",
      "Exclusive member-only events",
      "Free late checkout",
      "1 free night every 2 months",
      "Dedicated travel manager",
    ],
    cta: "Get Nomad",
    popular: true,
  },
  {
    name: "Wanderer",
    price: 4999,
    period: "month",
    color: "from-[var(--color-accent)] to-[var(--color-brand-primary)]",
    features: [
      "15% discount on all bookings",
      "VIP check-in + room upgrade",
      "Free meals (B+L+D)",
      "Unlimited event access",
      "Free cancellation anytime",
      "2 free nights every month",
      "Personal travel curator",
      "Access to exclusive properties",
    ],
    cta: "Get Wanderer",
    popular: false,
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-teal)] text-[var(--color-text-inverse)] py-24 px-4 text-center">
        <span className="inline-block px-4 py-1.5 bg-[var(--color-surface)]/20 rounded-full text-sm font-medium mb-4">
          🎫 Dostel Membership
        </span>
        <h1 className="heading-4xl font-playfair mb-4">
          Travel more for less
        </h1>
        <p className="body-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Unlock exclusive discounts, free nights, priority access and more with a Dostel membership.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden ${plan.popular ? "ring-2 ring-[var(--color-brand-secondary)] shadow-xl scale-105" : "border border-[var(--color-border)] shadow-sm"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-medium text-[var(--color-text-inverse)] bg-[var(--color-brand-secondary)]">
                  Most popular
                </div>
              )}
              <div className={`bg-gradient-to-br ${plan.color} p-6 pt-${plan.popular ? "10" : "6"} text-[var(--color-text-inverse)]`}>
                <p className="font-bold text-lg">{plan.name}</p>
                <p className="mt-2">
                  <span className="text-4xl font-extrabold">₹{plan.price}</span>
                  <span className="text-[var(--color-text-inverse)]/80 text-sm">/{plan.period}</span>
                </p>
              </div>
              <div className="bg-[var(--color-surface)] p-6">
                <ul className="space-y-4 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                      <svg className="w-4 h-4 text-[var(--color-brand-secondary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    plan.popular
                      ? "bg-[var(--color-brand-secondary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-primary)]/90"
                      : "bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-secondary)]/90"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="heading-xl font-playfair text-[var(--color-brand-primary)] mb-6 uppercase tracking-wider">
            Why join?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-8">
            {[
              { num: "₹12K+", label: "Avg annual savings" },
              { num: "500+", label: "Partner hostels" },
              { num: "50K+", label: "Active members" },
              { num: "100%", label: "Cancel anytime" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--color-bg-muted)] rounded-2xl p-6 text-center">
                <p className="text-3xl font-extrabold text-[var(--color-brand-secondary)]">{stat.num}</p>
                <p className="text-[var(--color-text-muted)] text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}