'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchListingById } from '@/services/listingService';

type ListingPayload = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: string;
  city: string;
  district: string;
  category?: {
    name: string;
    slug: string;
  };
  images: { id: string; url: string }[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params?.id as string;

  const [listing, setListing] = useState<ListingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;

    const loadListing = async () => {
      try {
        const response = await fetchListingById(listingId);
        setListing(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load listing details.');
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
        <div className="container mx-auto rounded-3xl bg-white p-10 shadow-lg text-center">
          <p className="text-lg font-medium">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
        <div className="container mx-auto rounded-3xl bg-white p-10 shadow-lg text-center text-red-700">
          <p>{error || 'Listing not found.'}</p>
          <Link href="/listings" className="mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 text-white hover:bg-orange-500 transition">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">{listing.title}</h1>
              <p className="text-gray-600 mt-2">{listing.category?.name || 'Uncategorized'} · {listing.city}, {listing.district}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/listings" className="inline-flex items-center justify-center rounded-2xl bg-gray-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-200 transition">
                Back to listings
              </Link>
              <Link
                href={`/payment/checkout?listingId=${listing.id}&amount=${listing.price}`}
                className="inline-flex items-center justify-center rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Promote listing
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          {listing.images.length > 0 ? (
            <img src={listing.images[0].url} alt={listing.title} className="mb-6 h-80 w-full rounded-3xl object-cover" />
          ) : (
            <div className="mb-6 h-80 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-400">No image available</div>
          )}

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">About this listing</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </section>

              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-gray-50 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Price</p>
                  <p className="mt-3 text-3xl font-semibold">Rs {listing.price.toFixed(0)}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Condition</p>
                  <p className="mt-3 text-lg font-semibold">{listing.condition}</p>
                </div>
              </section>
            </div>
            <aside className="rounded-3xl bg-gray-50 p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Category</p>
                  <p className="mt-2 text-lg font-semibold">{listing.category?.name || 'Uncategorized'}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Location</p>
                  <p className="mt-2 text-lg font-semibold">{listing.city}, {listing.district}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Status</p>
                  <p className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{listing.status}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Negotiable</p>
                  <p className="mt-2 text-lg font-semibold">{listing.negotiable ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
