const sections = {
  rooms: {
    title: "Rooms",
    description: "Manage room types, beds, amenities, and availability.",
  },
  rates: {
    title: "Rates",
    description: "Configure nightly rates, seasonal pricing, and stay rules.",
  },
  housekeeping: {
    title: "Housekeeping",
    description: "Track rooms that are dirty, clean, or ready for inspection.",
  },
  reports: {
    title: "Reports",
    description: "Review occupancy, revenue, and property performance.",
  },
} as const;

type Section = keyof typeof sections;

export default function PlaceholderPage({ section }: { section: Section }) {
  const content = sections[section];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold text-forest-900">{content.title}</h1>
        <p className="mt-0.5 text-sm text-stone-400">{content.description}</p>
      </div>
      <div className="rounded-xl border border-dashed border-stone-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-forest-900">{content.title} workspace</p>
        <p className="mt-1 text-sm text-stone-400">This module is ready for its first PMS workflow.</p>
      </div>
    </div>
  );
}
