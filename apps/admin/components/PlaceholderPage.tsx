const sections = {
  rates: {
    title: 'Rates',
    description: 'Configure nightly rates, seasonal pricing, and stay rules.',
  },
  housekeeping: {
    title: 'Housekeeping',
    description: 'Track rooms that are dirty, clean, or ready for inspection.',
  },
  reports: {
    title: 'Reports',
    description: 'Review occupancy, revenue, and property performance.',
  },
} as const;

export default function PlaceholderPage({ section }: { section: keyof typeof sections }) {
  const content = sections[section];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
        <p className="mt-1 text-gray-600">{content.description}</p>
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-gray-500">
          {content.title} workspace is ready for its first PMS workflow.
        </div>
      </div>
    </main>
  );
}
