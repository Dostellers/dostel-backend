'use client';

// Used by apps/admin/app/layout.tsx. Reads localStorage token + admin-auth cookie.
// User instruction: "fix it" — hung on Checking authentication because /login
// missing and soft router.replace failed when /_next chunks were blocked.

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

function hasAdminCookie () {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith('admin-auth='));
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const isLogin = pathname === '/login';

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem('token')) || hasAdminCookie();

    if (isLogin) {
      if (hasToken) {
        router.replace('/dashboard');
        return;
      }
      setReady(true);
      setAuthenticated(false);
      return;
    }

    if (!hasToken) {
      window.location.replace('/login');
      return;
    }

    setAuthenticated(true);
    setReady(true);
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (!ready || !authenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">Checking authentication...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
