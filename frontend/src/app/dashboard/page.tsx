'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchDashboard } from '@/services/userService';

interface DashboardData {
  fullName: string;
  email: string;
  profileImage?: string;
  role: string;
  emailVerified: boolean;
  joinedAt: string;
  totalListings: number;
  activeListings: number;
  favoritesCount: number;
  chatCount: number;
  messageCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await fetchDashboard(token);
        setDashboard(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium text-red-600">{error || 'Dashboard data not available.'}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-white hover:bg-orange-500 transition"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                {dashboard.profileImage ? (
                  <img src={dashboard.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-white text-3xl">
                    {dashboard.fullName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-semibold">{dashboard.fullName}</h1>
                <p className="text-sm text-gray-500">{dashboard.email}</p>
                <p className="text-sm text-gray-500">{dashboard.role} • {dashboard.emailVerified ? 'Verified' : 'Unverified'}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/chat" className="rounded-2xl bg-primary px-5 py-3 text-white text-center transition hover:bg-orange-500">Open chats</a>
              <a href="/profile" className="rounded-2xl bg-secondary px-5 py-3 text-white text-center transition hover:bg-blue-700">Edit profile</a>
              <a href="/" className="rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 text-center transition hover:bg-gray-100">Back home</a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Joined</p>
            <h2 className="mt-3 text-3xl font-semibold">{new Date(dashboard.joinedAt).toLocaleDateString()}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Active listings</p>
            <h2 className="mt-3 text-3xl font-semibold">{dashboard.activeListings}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Favorites</p>
            <h2 className="mt-3 text-3xl font-semibold">{dashboard.favoritesCount}</h2>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Total listings</p>
            <h2 className="mt-3 text-3xl font-semibold">{dashboard.totalListings}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Chats</p>
            <h2 className="mt-3 text-3xl font-semibold">{dashboard.chatCount}</h2>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Messages sent</p>
            <h2 className="mt-3 text-3xl font-semibold">{dashboard.messageCount}</h2>
          </div>
        </section>
      </div>
    </div>
  );
}
