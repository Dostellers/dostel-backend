'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const isLogin = pathname === '/login';

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem('token'));

    if (isLogin) {
      if (hasToken) router.replace('/dashboard');
      return;
    }

    if (!hasToken) {
      router.replace('/login');
      return;
    }

    setAuthenticated(true);
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;

  if (!authenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">Checking authentication...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
