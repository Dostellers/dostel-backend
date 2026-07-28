import Link from "next/link";
import MemberHeader from "@/components/MemberHeader";
import PointsBar from "@/components/PointsBar";
import QuickActions from "@/components/QuickActions";
import BadgeGrid from "@/components/BadgeGrid";
import { hostels, dostellerBadges } from "@/lib/data";

const mockMember = { name: "Rahul Sharma", tier: "Silver", avatar: "👨🏾‍🎓" };
const mockPoints = { current: 320, nextThreshold: 1000, tier: "Silver", rewardValue: 320 };
const mockStays = [
  { slug: "dostel-kasol-parvati-valley", name: "Kasol, Parvati Valley", checkIn: "2025-08-05", checkOut: "2025-08-07", room: "Mixed Dorm (6 Bed)", paid: 781 },
];

const quickActions = [
  { label: "Book a stay", icon: "🛏️", href: "/hostels", desc: "Find your next trip" },
  { label: "Browse events", icon: "🎉", href: "/events", desc: "Member pricing" },
  { label: "My badges", icon: "⭐", href: "/dashboard/badges", desc: `${dostellerBadges.filter((b) => b.unlocked).length} unlocked` },
  { label: "My profile", icon: "👤", href: "#", desc: "Edit preferences" },
];

export default function DashboardPage() {
  const featuredHostel = hostels[0];

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <MemberHeader name={mockMember.name} tier={mockMember.tier} avatar={mockMember.avatar} />

        <PointsBar current={mockPoints.current} nextThreshold={mockPoints.nextThreshold} tier={mockPoints.tier} rewardValue={mockPoints.rewardValue} />

        {mockStays.length > 0 ? (
          <div>
            <h2 className="font-heading text-lg font-semibold text-forest-900 mb-4">Upcoming stays</h2>
            {mockStays.map((stay) => {
              const hostel = hostels.find((h) => h.slug === stay.slug);
              return (
                <Link key={stay.slug} href={`/hostels/${stay.slug}`} className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {hostel && <img src={hostel.image} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-forest-900">{stay.name}</p>
                    <p className="text-xs text-stone-400">{stay.checkIn} → {stay.checkOut} · {stay.room}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-forest-500">₹{stay.paid}</p>
                    <p className="text-xs text-stone-400">Paid</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
            <span className="text-4xl mb-3 block">🗺️</span>
            <p className="text-forest-900 font-semibold">No upcoming stays</p>
            <p className="text-sm text-stone-400 mt-1 mb-4">Start planning your next adventure</p>
            <Link href="/hostels" className="inline-flex h-10 items-center rounded-lg bg-sunset px-5 text-sm font-semibold text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]">
              Browse hostels
            </Link>
          </div>
        )}

        <div>
          <h2 className="font-heading text-lg font-semibold text-forest-900 mb-4">Quick actions</h2>
          <QuickActions actions={quickActions} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-forest-900">Badges</h2>
            <Link href="/dashboard/badges" className="text-xs text-forest-500 hover:text-forest-700 font-medium">View all</Link>
          </div>
          <BadgeGrid badges={dostellerBadges} max={3} />
        </div>

        {featuredHostel && (
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-all duration-250 hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
              <div className="h-40 w-full sm:h-auto sm:w-48 shrink-0">
                <img src={featuredHostel.image} alt={featuredHostel.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5 flex-1">
                <span className="text-xs font-medium text-sunset uppercase tracking-wider">Recommended for you</span>
                <h3 className="font-heading text-lg font-semibold text-forest-900 mt-1">{featuredHostel.name}</h3>
                <p className="text-sm text-stone-400 mt-1">{featuredHostel.location}</p>
                <p className="text-sm text-stone-600 mt-2 line-clamp-2">{featuredHostel.description}</p>
                <Link href={`/hostels/${featuredHostel.slug}`} className="mt-3 inline-flex h-9 items-center rounded-lg bg-forest-500 px-4 text-xs font-semibold text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]">
                  Dosteller pricing available
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
