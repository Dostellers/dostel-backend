"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/hostels", label: "Hostels", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/rooms", label: "Rooms", icon: "M3 7v10m18-7v7M3 13h18M7 13V9h7a3 3 0 013 3v1M3 17h18" },
  { href: "/bookings", label: "Bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/guests", label: "Guests", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href: "/rates", label: "Rates", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-6V6m0 10v2m8-6a8 8 0 11-16 0 8 8 0 0116 0z" },
  { href: "/housekeeping", label: "Housekeeping", icon: "M5 3v4m0 0l4 12m-4-12l12 4m2-6l-4 14m-8-4h8" },
  { href: "/reports", label: "Reports", icon: "M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-500">
          <span className="text-sm font-bold text-white">D</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-forest-900">Dostel Admin</p>
          <p className="text-xs text-stone-400">PMS v1.0</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                active
                  ? "bg-forest-100 text-forest-700 font-medium"
                  : "text-stone-500 hover:bg-stone-100 hover:text-forest-700"
              }`}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-stone-200 p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-700">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-forest-900 truncate">Admin User</p>
            <p className="text-[10px] text-stone-400">admin@dostel.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
