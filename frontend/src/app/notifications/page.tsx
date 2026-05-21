'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchNotifications, markNotificationRead } from '@/services/notificationService';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications(token);
        setNotifications(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [router, token]);

  const handleMarkRead = async (id: string) => {
    if (!token) return;
    try {
      await markNotificationRead(token, id);
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item)));
    } catch {
      setError('Unable to update notification status.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Notifications</h1>
          <p className="text-gray-600">View all your in-app notifications and mark them as read.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-gray-600">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{notification.title}</h2>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notification.id)}
                    className="rounded-2xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {notification.isRead ? 'Read' : 'Mark read'}
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
