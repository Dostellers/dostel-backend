"use client";
import { hostels } from "@/lib/data";

export default function HostelsPage() {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-forest-900">Hostels</h1>
          <p className="text-sm text-stone-400 mt-0.5">{hostels.length} properties</p>
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg bg-forest-500 px-4 text-sm font-medium text-white transition-all duration-150 hover:brightness-95 active:scale-[0.97]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add hostel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {hostels.map((h) => (
          <div key={h.id} className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-forest-900">{h.name}</h3>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                {h.status}
              </span>
            </div>
            <p className="text-xs text-stone-400">{h.location}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Rooms</span>
                <span className="font-medium text-forest-900">{h.rooms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Occupancy</span>
                <span className="font-medium text-forest-900">{h.occupancy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Revenue (MTD)</span>
                <span className="font-medium text-forest-900">₹{h.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div className="h-full rounded-full bg-forest-500" style={{ width: `${h.occupancy}%` }} />
            </div>
            <button className="w-full rounded-lg border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors">
              Manage hostel →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
