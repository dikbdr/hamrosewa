'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPaymentSession } from '@/services/paymentService';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listingId, setListingId] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('KHALTI');
  const [paymentGateway, setPaymentGateway] = useState('KHALTI');
  const [message, setMessage] = useState<string | null>(null);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const listingParam = searchParams.get('listingId');
    const amountParam = searchParams.get('amount');
    if (listingParam) {
      setListingId(listingParam);
    }
    if (amountParam) {
      const parsedAmount = Number(amountParam);
      if (!Number.isNaN(parsedAmount)) {
        setAmount(parsedAmount);
      }
    }
  }, [router, token, searchParams]);

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!token) {
      setError('You must be logged in to make a payment.');
      setLoading(false);
      return;
    }

    try {
      const response = await createPaymentSession(token, {
        listingId,
        amount,
        paymentMethod,
        paymentGateway,
      });
      setSessionUrl(response.data.data.sessionUrl);
      setMessage('Payment session created successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to create payment session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-3">Payment Checkout</h1>
          <p className="text-gray-600">Create a payment session for a listing promotion or featured ad.</p>
        </div>

        {error && <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>}
        {message && (
          <div className="rounded-3xl bg-green-50 border border-green-200 p-6 text-green-700">
            <p>{message}</p>
            {sessionUrl && (
              <a
                href={sessionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-3 rounded-2xl bg-primary px-5 py-3 text-white hover:bg-orange-500 transition"
              >
                Open payment verification
              </a>
            )}
          </div>
        )}

        <form className="rounded-3xl bg-white p-8 shadow-lg space-y-6" onSubmit={handleCheckout}>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Listing ID</span>
            <input
              required
              value={listingId}
              onChange={(event) => setListingId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Amount</span>
            <input
              required
              type="number"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Payment Method</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="KHALTI">Khalti</option>
                <option value="ESEWA">eSewa</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Payment Gateway</span>
              <select
                value={paymentGateway}
                onChange={(event) => setPaymentGateway(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="KHALTI">Khalti</option>
                <option value="ESEWA">eSewa</option>
                <option value="STRIPE">Stripe</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-primary px-6 py-4 text-white font-semibold hover:bg-orange-500 transition disabled:opacity-50"
          >
            {loading ? 'Creating session...' : 'Create payment session'}
          </button>
        </form>
      </div>
    </div>
  );
}
