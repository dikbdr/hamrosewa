'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAdminReports } from '@/services/adminService';

type ReportData = {
  recentUsers: Array<{ id: string; email: string; firstName?: string; role: string; createdAt: string }>;
  recentPayments: Array<{ id: string; amount: number; currency: string; paymentMethod: string; paymentGateway: string; status: string; createdAt: string; userId: string; listingId: string }>;
  recentListings: Array<{ id: string; title: string; status: string; createdAt: string; sellerId: string }>;
};

export default function AdminReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const loadReports = async () => {
      try {
        const response = await fetchAdminReports(token);
        setReports(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load admin reports.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [router, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Admin Reports</h1>
          <p className="text-gray-600">Review the latest site activity and payment transactions in one place.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
        ) : reports ? (
          <div className="grid gap-6">
            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Recent Users</h2>
              <div className="grid gap-3">
                {reports.recentUsers.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-gray-200 p-4">
                    <p className="font-semibold">{user.firstName || user.email}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">Role: {user.role}</p>
                    <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Recent Payments</h2>
              <div className="grid gap-3">
                {reports.recentPayments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-gray-200 p-4">
                    <p className="font-semibold">{payment.currency} {payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Method: {payment.paymentMethod}</p>
                    <p className="text-sm text-gray-500">Gateway: {payment.paymentGateway}</p>
                    <p className="text-sm text-gray-500">Status: {payment.status}</p>
                    <p className="text-sm text-gray-500">User ID: {payment.userId}</p>
                    <p className="text-sm text-gray-500">Listing ID: {payment.listingId}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Recent Listings</h2>
              <div className="grid gap-3">
                {reports.recentListings.map((listing) => (
                  <div key={listing.id} className="rounded-2xl border border-gray-200 p-4">
                    <p className="font-semibold">{listing.title || listing.id}</p>
                    <p className="text-sm text-gray-500">Status: {listing.status}</p>
                    <p className="text-sm text-gray-500">Seller ID: {listing.sellerId}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(listing.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
