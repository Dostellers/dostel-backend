import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import { dashboardMetrics, bookings, hostels, statusConfig } from "@/lib/data";

export default function AdminDashboardPage() {
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.checkIn === today || b.checkOut === today);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-xl font-semibold text-forest-900">Dashboard</h1>
        <p className="text-sm text-stone-400 mt-0.5">Today&apos;s overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white">
          <div className="border-b border-stone-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-forest-900">Today&apos;s bookings ({todayBookings.length})</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {todayBookings.length === 0 ? (
              <p className="p-5 text-sm text-stone-400">No bookings today</p>
            ) : (
              todayBookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-forest-900">{b.guest}</p>
                    <p className="text-xs text-stone-400">{b.hostel} · {b.room}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-forest-900">₹{b.total}</span>
                    <StatusBadge status={b.status} config={statusConfig} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white">
          <div className="border-b border-stone-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-forest-900">Hostel occupancy</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {hostels.map((h) => (
              <div key={h.id} className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-forest-900">{h.name}</p>
                  <span className="text-xs font-medium text-forest-900">{h.occupancy}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full rounded-full bg-forest-500 transition-all" style={{ width: `${h.occupancy}%` }} />
                </div>
                <p className="text-xs text-stone-400">{h.location} · {h.rooms} rooms</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
