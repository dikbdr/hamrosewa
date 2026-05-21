'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRootPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [router, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Admin Panel</h1>
          <p className="text-gray-600">Access admin dashboards, user management, listings moderation, categories, and reports.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/admin/dashboard" className="rounded-3xl bg-primary p-6 text-white shadow-lg hover:bg-orange-500 transition">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <p className="mt-2 text-sm text-white/80">Site health, active listings, payments, chats, and notifications.</p>
          </Link>
          <Link href="/admin/users" className="rounded-3xl bg-white p-6 shadow-lg border border-gray-200 hover:border-primary transition">
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="mt-2 text-sm text-slate-500">View users, change roles, and manage accounts.</p>
          </Link>
          <Link href="/admin/listings" className="rounded-3xl bg-white p-6 shadow-lg border border-gray-200 hover:border-primary transition">
            <h2 className="text-xl font-semibold">Listings</h2>
            <p className="mt-2 text-sm text-slate-500">Review listings, activate or deactivate content, and manage marketplace inventory.</p>
          </Link>
          <Link href="/admin/categories" className="rounded-3xl bg-white p-6 shadow-lg border border-gray-200 hover:border-primary transition">
            <h2 className="text-xl font-semibold">Categories</h2>
            <p className="mt-2 text-sm text-slate-500">Manage category taxonomy for listings and browsing.</p>
          </Link>
          <Link href="/admin/reports" className="rounded-3xl bg-white p-6 shadow-lg border border-gray-200 hover:border-primary transition sm:col-span-2">
            <h2 className="text-xl font-semibold">Reports</h2>
            <p className="mt-2 text-sm text-slate-500">View recent user sign-ups, payment transactions, and listing activity.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
