'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { fetchUserProfile } from '@/services/userService';

type NotificationToast = {
  id: string;
  title: string;
  message: string;
};

export default function NotificationListener() {
  const [toast, setToast] = useState<NotificationToast | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;
    if (!token) return;

    let socket: ReturnType<typeof io> | null = null;
    let timer: number | undefined;

    const initSocket = async () => {
      try {
        const response = await fetchUserProfile(token);
        const userId = response.data.data.id;
        socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
          transports: ['websocket'],
        });

        socket.emit('join-user', userId);

        socket.on('notification', (notification: any) => {
          if (!notification) return;
          setToast({
            id: notification.id,
            title: notification.title,
            message: notification.message,
          });
          setIsVisible(true);
          if (timer) {
            window.clearTimeout(timer);
          }
          timer = window.setTimeout(() => {
            setIsVisible(false);
            setToast(null);
          }, 6000);
        });
      } catch (error) {
        console.error('Notification listener failed', error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  if (!toast || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">New notification</p>
            <h2 className="mt-2 text-lg font-semibold">{toast.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setToast(null);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          <Link href="/notifications" className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 transition">
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
}
