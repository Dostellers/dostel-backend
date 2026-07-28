import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { guests } from "@/lib/data";

const tierConfig: Record<string, { label: string; color: string }> = {
  bronze: { label: "Bronze", color: "bg-stone-100 text-stone-600" },
  silver: { label: "Silver", color: "bg-stone-100 text-stone-500" },
  gold: { label: "Gold", color: "bg-sunset/10 text-sunset" },
};

const columns = [
  { key: "name", label: "Guest", render: (g: typeof guests[number]) => (
    <div>
      <p className="font-medium text-forest-900">{g.name}</p>
      <p className="text-xs text-stone-400">{g.email}</p>
    </div>
  )},
  { key: "phone", label: "Phone", className: "text-stone-600" },
  { key: "bookings", label: "Bookings", render: (g: typeof guests[number]) => (
    <span className="font-medium text-forest-900">{g.bookings}</span>
  )},
  { key: "totalSpent", label: "Total spent", render: (g: typeof guests[number]) => (
    <span className="font-medium text-forest-900">₹{g.totalSpent.toLocaleString()}</span>
  )},
  { key: "lastStay", label: "Last stay", render: (g: typeof guests[number]) => (
    <span className="text-stone-600">{g.lastStay || "—"}</span>
  )},
  { key: "tier", label: "Tier", render: (g: typeof guests[number]) => (
    <StatusBadge status={g.tier} config={tierConfig} />
  )},
];

export default function GuestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-forest-900">Guests</h1>
          <p className="text-sm text-stone-400 mt-0.5">{guests.length} registered guests</p>
        </div>
      </div>
      <DataTable columns={columns} data={guests} keyField="id" emptyMessage="No guests found" />
    </div>
  );
}
