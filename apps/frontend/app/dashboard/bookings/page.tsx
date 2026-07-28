import Link from "next/link";

const mockBookings = [
  { id: "DOS-2025-08-A1B2C", hostel: "Dostel Kasol", location: "Kasol, HP", checkIn: "Aug 5, 2025", checkOut: "Aug 7, 2025", room: "Mixed Dorm (6 Bed)", total: 781, status: "confirmed" },
  { id: "DOS-2025-06-X9Y8Z", hostel: "Dostel Goa", location: "Anjuna, Goa", checkIn: "Jun 12, 2025", checkOut: "Jun 15, 2025", room: "Female Only Dorm (4 Bed)", total: 1197, status: "completed" },
];

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-forest-500 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>

        <div>
          <h1 className="font-heading text-3xl font-semibold text-forest-900">My bookings</h1>
          <p className="mt-1 text-stone-400">{mockBookings.length} booking{mockBookings.length !== 1 ? "s" : ""}</p>
        </div>

        {mockBookings.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
            <span className="text-4xl mb-3 block">📋</span>
            <p className="text-forest-900 font-semibold">No bookings yet</p>
            <p className="text-sm text-stone-400 mt-1 mb-4">Your trips will appear here</p>
            <Link href="/hostels" className="inline-flex h-10 items-center rounded-lg bg-sunset px-5 text-sm font-semibold text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]">
              Browse hostels
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockBookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{b.hostel}</p>
                    <p className="text-xs text-stone-400">{b.location}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    b.status === "confirmed" ? "bg-forest-100 text-forest-700" : "bg-stone-100 text-stone-500"
                  }`}>
                    {b.status === "confirmed" ? "Upcoming" : "Completed"}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-stone-600">
                  <span>{b.checkIn} → {b.checkOut}</span>
                  <span className="text-stone-300">|</span>
                  <span>{b.room}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                  <span className="text-xs text-stone-400">{b.id}</span>
                  <span className="text-sm font-bold text-forest-900">₹{b.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
