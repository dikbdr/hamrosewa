'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const successParam = searchParams.get('success');
  const [statusMessage, setStatusMessage] = useState<string>('Verifying payment...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setError('Payment ID is missing.');
        setLoading(false);
        return;
      }

      const success = successParam === 'false' ? false : true;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      try {
        const response = await fetch(
          `${apiUrl}/api/payments/verify?paymentId=${encodeURIComponent(paymentId)}&success=${success}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || 'Unable to verify payment.');
        }

        setStatusMessage(result.message || 'Payment verification completed successfully.');
      } catch (err: any) {
        setError(err?.message || 'Unable to verify payment.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentId, successParam]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-3">Payment Status</h1>
          <p className="text-gray-600">Your payment result is being processed.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Verifying payment...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="rounded-3xl bg-green-50 border border-green-200 p-6 text-green-700 shadow-sm">
            <p className="text-lg font-semibold">{statusMessage}</p>
          </div>
        )}

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <Link href="/payment/history" className="inline-flex rounded-3xl bg-primary px-6 py-3 text-white font-semibold hover:bg-orange-500 transition">
            View payment history
          </Link>
          <Link href="/listings" className="inline-flex ml-4 rounded-3xl border border-gray-200 px-6 py-3 text-slate-700 font-semibold hover:bg-gray-100 transition">
            Continue browsing listings
          </Link>
        </div>
      </div>
    </div>
  );
}
