import Link from "next/link";

const tiers = [
  {
    name: "Dosteller Explorer",
    price: 999,
    period: "month",
    tag: "For the weekend crew",
    bestFor: "Solo travelers, friend groups, and weekenders who visit once a quarter.",
    color: "from-[var(--color-brand-primary)] to-[var(--color-brand-teal)]",
    features: [
      "5% off all bookings",
      "Priority check-in",
      "Free breakfast twice a month at Altaf's Cafe",
      "Dostellers WhatsApp group access",
      "Member-only treks, bonfires, and game nights",
    ],
    cta: "Join as an Explorer",
    popular: false,
  },
  {
    name: "Dosteller Nomad",
    price: 1999,
    period: "month",
    tag: "For the regulars",
    bestFor: "Remote workers, monthly visitors, and people who return every season.",
    color: "from-[var(--color-brand-secondary)] to-[var(--color-accent)]",
    features: [
      "10% off all bookings",
      "Priority check-in",
      "Free breakfast daily",
      "1 free night every 2 months",
      "Late checkout, subject to availability",
      "Exclusive member dinners",
      "Dedicated Dostel host contact",
    ],
    cta: "Join as a Nomad",
    popular: true,
  },
  {
    name: "Dosteller Wanderer",
    price: 4999,
    period: "month",
    tag: "For the family",
    bestFor: "Long-stayers, couples, families, and people who treat Dostel as a second home.",
    color: "from-[var(--color-accent)] to-[var(--color-brand-primary)]",
    features: [
      "15% off all bookings",
      "VIP check-in and room upgrades when available",
      "Free breakfast, lunch, and dinner",
      "2 free nights every month",
      "Unlimited event access",
      "Free cancellation anytime",
      "Personal host who knows your preferences",
      "Early access to new rooms and events",
    ],
    cta: "Join as a Wanderer",
    popular: false,
  },
];

const faqs = [
  {
    question: "Do I have to be a Dosteller to book?",
    answer: "Not at all. Anyone can book a room. Dostellers is for people who stay regularly and want the community experience.",
  },
  {
    question: "Can I switch tiers?",
    answer: "Yes. Upgrade or downgrade anytime. Changes apply from your next billing cycle.",
  },
  {
    question: "What's the WhatsApp group like?",
    answer: "Travel plans, trek coordination, 'who's at Altaf's tonight?' messages, and the occasional dog photo. It's a genuine community, not a marketing broadcast.",
  },
  {
    question: "Does Dostellers work at other Dostel hostels?",
    answer: "Dostel is one hostel in Vattakanal. Dostellers benefits apply here. If we expand, reciprocity will follow.",
  },
  {
    question: "Can I gift a Dostellers membership?",
    answer: "Yes. Gift memberships are available. Contact us for details.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. There's no lock-in. Cancel from your profile. If you rejoin within 6 months, your tenure and tier history carries over.",
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <section className="bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-teal)] text-[var(--color-text-inverse)] py-24 px-4 text-center">
        <span className="inline-block px-4 py-1.5 bg-[var(--color-surface)]/20 rounded-full text-sm font-medium mb-4">
          Dostellers — The Dostel Community
        </span>
        <h1 className="heading-4xl font-playfair mb-4">Become a Dosteller</h1>
        <p className="body-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          More than a membership. A community of travelers, remote workers, and mountain-lovers who call Vattakanal a home base. Discounted stays, exclusive events, and a network that travels together.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-2xl font-playfair text-[var(--color-brand-primary)] mb-6">
            Long-stay community, short-stay benefits
          </h2>
          <div className="space-y-4 text-[var(--color-text-secondary)]">
            <p>
              Dostellers started as the name we gave to guests who kept coming back — the ones who would book a weekend and stay a month. The ones who knew Altaf by name, who would lead impromptu treks to Dolphin&apos;s Nose, who would show up at the bonfire with a guitar.
            </p>
            <p>
              We formalized it so you get better rates, priority access, and a network of people who get it. But the soul is the same: you show up, you belong.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: "Community",
              items: ["Private Dostellers WhatsApp group", "Monthly dinners at Altaf's Cafe", "Group treks and events"],
            },
            {
              title: "Savings",
              items: ["5–15% off bookings", "Free nights at higher tiers", "Long-stay rates apply"],
            },
            {
              title: "Access",
              items: ["Priority check-in", "Late checkout", "Dedicated Dostel host"],
            },
          ].map((value) => (
            <div key={value.title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="font-bold text-lg text-[var(--color-brand-primary)] mb-4">{value.title}</h3>
              <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                {value.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div id="tiers" className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl overflow-hidden ${tier.popular ? "ring-2 ring-[var(--color-brand-secondary)] shadow-xl sm:scale-105" : "border border-[var(--color-border)] shadow-sm"}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-medium text-[var(--color-text-inverse)] bg-[var(--color-brand-secondary)]">
                  Most popular
                </div>
              )}
              <div className={`bg-gradient-to-br ${tier.color} p-6 ${tier.popular ? "pt-10" : "pt-6"} text-[var(--color-text-inverse)]`}>
                <p className="font-bold text-lg">{tier.name}</p>
                <p className="text-sm mt-1 text-[var(--color-text-inverse)]/80">{tier.tag}</p>
                <p className="mt-3">
                  <span className="text-4xl font-extrabold">₹{tier.price}</span>
                  <span className="text-[var(--color-text-inverse)]/80 text-sm">/{tier.period}</span>
                </p>
              </div>
              <div className="bg-[var(--color-surface)] p-6">
                <p className="text-sm text-[var(--color-text-muted)] mb-5">{tier.bestFor}</p>
                <ul className="space-y-4 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                      <svg className="w-4 h-4 text-[var(--color-brand-secondary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full px-6 py-3 text-sm font-medium text-center rounded-xl transition-all duration-200 ${
                    tier.popular
                      ? "bg-[var(--color-brand-secondary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-primary)]/90"
                      : "bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-secondary)]/90"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-bg-muted)] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="heading-xl font-playfair text-[var(--color-brand-primary)] mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick your tier", body: "Choose Explorer, Nomad, or Wanderer based on how often you stay." },
              { step: "2", title: "Sign up", body: "Create a Dostel profile. Takes 2 minutes. No hidden fees." },
              { step: "3", title: "Start staying", body: "Your rates apply instantly. Events and the WhatsApp community are waiting." },
            ].map((item) => (
              <div key={item.step}>
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-brand-secondary)] text-[var(--color-text-inverse)] font-bold mb-4">{item.step}</span>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="heading-xl font-playfair text-[var(--color-brand-primary)] mb-8">Rooted in Vattakanal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          {[
            { num: "1985", label: "The restoration story began" },
            { num: "1", label: "Mountain hostel community" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--color-bg-muted)] rounded-2xl p-6">
              <p className="text-3xl font-extrabold text-[var(--color-brand-secondary)]">{stat.num}</p>
              <p className="text-[var(--color-text-muted)] text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="heading-xl font-playfair text-[var(--color-brand-primary)] mb-8 text-center">Questions about Dostellers</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <summary className="font-semibold cursor-pointer text-[var(--color-text-primary)]">{faq.question}</summary>
              <p className="mt-3 text-[var(--color-text-secondary)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] py-16 px-4 text-center">
        <h2 className="heading-2xl font-playfair mb-4">Join the community</h2>
        <p className="max-w-xl mx-auto mb-8 text-[var(--color-text-inverse)]/80">
          Come for the mountain. Stay for the people who make Vattakanal feel like home.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[var(--color-brand-secondary)] px-6 py-3 font-medium">
            Become a Dosteller
          </Link>
          <Link href="#tiers" className="inline-flex items-center justify-center rounded-xl border border-[var(--color-text-inverse)]/30 px-6 py-3 font-medium">
            See what&apos;s included
          </Link>
        </div>
      </section>
    </div>
  );
}
