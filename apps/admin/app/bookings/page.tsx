import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { bookings, statusConfig } from "@/lib/data";

const columns = [
  { key: "id", label: "Booking", render: (b: typeof bookings[number]) => (
    <span className="font-medium text-forest-900">{b.id}</span>
  )},
  { key: "guest", label: "Guest", className: "text-stone-600" },
  { key: "hostel", label: "Hostel", className: "text-stone-600" },
  { key: "room", label: "Room", className: "text-stone-600" },
  { key: "dates", label: "Dates", render: (b: typeof bookings[number]) => (
    <span className="text-xs text-stone-600">{b.checkIn} → {b.checkOut}</span>
  )},
  { key: "total", label: "Amount", render: (b: typeof bookings[number]) => (
    <span className="font-medium text-forest-900">₹{b.total}</span>
  )},
  { key: "status", label: "Status", render: (b: typeof bookings[number]) => (
    <StatusBadge status={b.status} config={statusConfig} />
  )},
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-forest-900">Bookings</h1>
          <p className="text-sm text-stone-400 mt-0.5">{bookings.length} total</p>
        </div>
      </div>
      <DataTable columns={columns} data={bookings} keyField="id" emptyMessage="No bookings found" />
    </div>
  );
}
