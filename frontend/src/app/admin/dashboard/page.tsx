'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAdminOverview } from '@/services/adminService';

type AdminOverview = {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalPayments: number;
  totalChats: number;
  unreadNotifications: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const loadOverview = async () => {
      try {
        const response = await fetchAdminOverview(token);
        setOverview(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [router, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of site activity, payments, users, and notifications.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading admin overview...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
        ) : overview ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Total users</p>
              <h2 className="mt-3 text-3xl font-semibold">{overview.totalUsers}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Active listings</p>
              <h2 className="mt-3 text-3xl font-semibold">{overview.activeListings}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Payments</p>
              <h2 className="mt-3 text-3xl font-semibold">{overview.totalPayments}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Total listings</p>
              <h2 className="mt-3 text-3xl font-semibold">{overview.totalListings}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Chats</p>
              <h2 className="mt-3 text-3xl font-semibold">{overview.totalChats}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Unread notifications</p>
              <h2 className="mt-3 text-3xl font-semibold">{overview.unreadNotifications}</h2>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
