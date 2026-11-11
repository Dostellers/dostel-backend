/* Callers: apps/admin/components/AuthGate.tsx imports ./Sidebar for the
   authenticated shell (rendered next to #main). Existing Sidebar.tsx used
   blue-700; replacing in place — same file, same export default Sidebar.
   Schema: none (nav links + logout clears localStorage token / admin-auth cookie).
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { canSeeNav } from '@/lib/auth/access'
import { useStaffRole } from '@/lib/auth/use-staff-role'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/hostels', label: 'Hostels' },
  { href: '/landing', label: 'Landing' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/customers', label: 'Guests' },
  { href: '/rates', label: 'Rates' },
  { href: '/housekeeping', label: 'Housekeeping' },
  { href: '/reports', label: 'Reports' },
  { href: '/staff', label: 'Staff' },
  { href: '/token-receipts', label: 'Token Receipts' },
]

export default function Sidebar () {
  const pathname = usePathname()
  const router = useRouter()
  const { role, activeOrg } = useStaffRole()

  const logout = async () => {
    await authClient.signOut()
    localStorage.removeItem('token')
    router.replace('/login')
  }

  const visibleNav = navItems.filter((item) => canSeeNav(role, item.href))

  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col bg-ink-1000 text-ink-100">
      <Link
        href="/dashboard"
        className="border-b border-white/10 px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400"
      >
        <span className="tag mb-2">Ops</span>
        <span className="mt-3 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Dostel"
            width={44}
            height={44}
            className="shrink-0 object-contain"
            priority
          />
          <span>
            <span className="block font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white">
              Dostel
            </span>
            <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink-400">
              {activeOrg?.name || 'Property board'}
            </span>
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Admin">
        {visibleNav.map((item) => {
          const active = pathname === item.href || Boolean(pathname?.startsWith(`${item.href}/`))
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={[
                'relative rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 min-h-[44px] flex items-center',
                active
                  ? 'bg-coral-600 text-white'
                  : 'text-ink-300 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-yellow-logo"
                  aria-hidden
                />
              )}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={logout}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-white/15 px-3 text-sm font-medium text-ink-200 transition hover:border-coral-400 hover:bg-coral-600 hover:text-white cursor-pointer"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
