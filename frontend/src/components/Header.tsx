'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchNotifications } from '@/services/notificationService';

export default function Header() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);

    const loadUnreadCount = async () => {
      try {
        const response = await fetchNotifications(token);
        const unread = response.data.data.filter((notification) => !notification.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Unable to load notification count', error);
      }
    };

    loadUnreadCount();
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">H</span>
          HamroSewa
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
            Home
          </Link>
          <Link href="/notifications" className="relative rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
            Notifications
            {unreadCount > 0 ? (
              <span className="absolute -right-2 -top-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Link>
          {isAuthenticated ? (
            <Link href="/profile" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              Profile
            </Link>
          ) : (
            <Link href="/login" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
