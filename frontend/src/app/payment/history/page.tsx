'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPaymentHistory } from '@/services/paymentService';

type PaymentHistoryItem = {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: string;
  status: string;
  purpose: string;
  createdAt: string;
  listing: { title: string; id: string };
};

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const loadPayments = async () => {
      try {
        const response = await fetchPaymentHistory(token);
        setPayments(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load payment history.');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [router, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Payment History</h1>
          <p className="text-gray-600">Review your payment transactions for listing promotions and featured ads.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading payment history...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
        ) : payments.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-gray-600">No payment records found yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{payment.listing.title}</h2>
                    <p className="text-sm text-gray-500">Status: {payment.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">Rs {payment.amount.toFixed(0)}</p>
                    <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm text-gray-600">
                  <span>Gateway: {payment.paymentGateway}</span>
                  <span>Method: {payment.paymentMethod}</span>
                  <span>Purpose: {payment.purpose}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
