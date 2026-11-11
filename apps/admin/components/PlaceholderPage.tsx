/* Callers: apps/admin/app/rates/page.tsx, housekeeping/page.tsx, reports/page.tsx
   each import PlaceholderPage and pass section. Existing gray stub — replace in place.
   Schema: none (static copy).
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

import { PageHeader } from '@/components/PageHeader'

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
} as const

export default function PlaceholderPage ({ section }: { section: keyof typeof sections }) {
  const content = sections[section]

  return (
    <main className="min-h-dvh px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <PageHeader title={content.title} description={content.description} />
        <div className="rounded-xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
          <p className="stamp text-coral-700 mb-4 inline-flex">Coming soon</p>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-ink-1000">
            {content.title} workspace
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
            Ready for its first PMS workflow — same coral/ink board as the rest of ops.
          </p>
        </div>
      </div>
    </main>
  )
}
