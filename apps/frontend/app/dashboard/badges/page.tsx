import Link from "next/link";
import BadgeGrid from "@/components/BadgeGrid";
import { dostellerBadges } from "@/lib/data";

export default function BadgesPage() {
  const unlocked = dostellerBadges.filter((b) => b.unlocked).length;
  const total = dostellerBadges.length;

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-forest-500 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>

        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold text-forest-900">Your badges</h1>
          <p className="mt-1 text-stone-400">{unlocked} of {total} unlocked</p>
        </div>

        <BadgeGrid badges={dostellerBadges} />
      </div>
    </div>
  );
}
