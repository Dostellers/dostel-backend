'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/hostels', label: 'Hostels' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/customers', label: 'Guests' },
  { href: '/rates', label: 'Rates' },
  { href: '/housekeeping', label: 'Housekeeping' },
  { href: '/reports', label: 'Reports' },
    { href: '/token-receipts', label: 'Token Receipts' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'admin-auth=; Max-Age=0; path=/';
    router.replace('/login');
  };

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-blue-700 text-white">
      <Link href="/dashboard" className="border-b border-blue-600 px-5 py-5 text-lg font-bold">
        Dostel Admin
      </Link>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || Boolean(pathname?.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm ${active ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={logout} className="m-3 mt-auto rounded-md border border-blue-400 px-3 py-2 text-left text-sm hover:bg-blue-600">
        Log out
      </button>
    </aside>
  );
}
