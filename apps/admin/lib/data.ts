export const hostels = [
  { id: "1", name: "Dostel Kasol", location: "Kasol, HP", rooms: 6, occupancy: 78, revenue: 124500, status: "active" },
  { id: "2", name: "Dostel Goa", location: "Anjuna, Goa", rooms: 4, occupancy: 92, revenue: 189200, status: "active" },
  { id: "3", name: "Dostel Coorg", location: "Madikeri, Coorg", rooms: 5, occupancy: 65, revenue: 98700, status: "active" },
];

export const bookings = [
  { id: "B-001", guest: "Rahul Sharma", hostel: "Dostel Kasol", room: "Mixed Dorm (6)", checkIn: "2025-08-05", checkOut: "2025-08-07", total: 781, status: "confirmed" },
  { id: "B-002", guest: "Priya Singh", hostel: "Dostel Goa", room: "Female Dorm (4)", checkIn: "2025-08-06", checkOut: "2025-08-10", total: 1596, status: "checked-in" },
  { id: "B-003", guest: "Arjun Mehta", hostel: "Dostel Kasol", room: "Private Room", checkIn: "2025-08-08", checkOut: "2025-08-09", total: 1299, status: "pending" },
  { id: "B-004", guest: "Lena Koch", hostel: "Dostel Coorg", room: "Deluxe Private", checkIn: "2025-08-01", checkOut: "2025-08-15", total: 26985, status: "checked-in" },
  { id: "B-005", guest: "Vikram Patel", hostel: "Dostel Goa", room: "Mixed Dorm (6)", checkIn: "2025-07-28", checkOut: "2025-07-30", total: 998, status: "completed" },
  { id: "B-006", guest: "Ananya Reddy", hostel: "Dostel Kasol", room: "Female Dorm (4)", checkIn: "2025-08-10", checkOut: "2025-08-12", total: 798, status: "cancelled" },
];

export const dashboardMetrics = [
  { label: "Occupancy", value: "78%", change: "+5%", changeType: "positive" as const },
  { label: "Revenue (MTD)", value: "₹4,12,300", change: "+12%", changeType: "positive" as const },
  { label: "Bookings Today", value: "8", change: "+3", changeType: "positive" as const },
  { label: "Check-ins Today", value: "6", change: "-2", changeType: "negative" as const },
];

export const guests = [
  { id: "G-001", name: "Rahul Sharma", email: "rahul@email.com", phone: "+91 98765 43210", bookings: 3, totalSpent: 2878, lastStay: "2025-08-05", tier: "silver" },
  { id: "G-002", name: "Priya Singh", email: "priya@email.com", phone: "+91 87654 32109", bookings: 5, totalSpent: 8950, lastStay: "2025-08-06", tier: "gold" },
  { id: "G-003", name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 76543 21098", bookings: 2, totalSpent: 1598, lastStay: "2025-08-08", tier: "bronze" },
  { id: "G-004", name: "Lena Koch", email: "lena@email.com", phone: "+49 176 12345678", bookings: 4, totalSpent: 32150, lastStay: "2025-08-01", tier: "silver" },
  { id: "G-005", name: "Vikram Patel", email: "vikram@email.com", phone: "+91 65432 10987", bookings: 1, totalSpent: 998, lastStay: "2025-07-28", tier: "bronze" },
  { id: "G-006", name: "Ananya Reddy", email: "ananya@email.com", phone: "+91 54321 09876", bookings: 2, totalSpent: 1596, lastStay: "2025-08-10", tier: "bronze" },
  { id: "G-007", name: "Amit Kumar", email: "amit@email.com", phone: "+91 43210 98765", bookings: 0, totalSpent: 0, lastStay: null, tier: "bronze" },
];

export const statusConfig: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "bg-sky/10 text-sky" },
  "checked-in": { label: "Checked In", color: "bg-forest-100 text-forest-700" },
  pending: { label: "Pending", color: "bg-sunset/10 text-sunset" },
  completed: { label: "Completed", color: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", color: "bg-error/10 text-error" },
};
