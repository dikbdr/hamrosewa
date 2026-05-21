'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchListings } from '@/services/listingService';

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
};

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadListings = async () => {
      try {
        const category = searchParams.get('category') || undefined;
        const search = searchParams.get('search') || undefined;
        const response = await fetchListings({ category, search });
        setListings(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load listings.');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Product Listings</h1>
              <p className="text-gray-600">Browse the latest active listings on HamroSewa.</p>
            </div>
            <a
              href="/search"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-white text-sm font-semibold hover:bg-orange-500 transition"
            >
              Advanced search
            </a>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading listings...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-white border border-red-200 p-6 shadow-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
                <p className="text-gray-600">No active listings available.</p>
              </div>
            ) : (
              listings.map((listing) => (
                <article key={listing.id} className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-xl transition">
                  <div className="h-56 w-full overflow-hidden rounded-3xl bg-gray-100 mb-4">
                    {listing.images.length > 0 ? (
                      <img src={listing.images[0].url} alt={listing.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-xl font-semibold">{listing.title}</h2>
                      <p className="text-sm text-gray-500">{listing.category?.name || 'Uncategorized'}</p>
                    </div>
                    <p className="text-lg font-semibold text-primary">Rs {listing.price.toFixed(0)}</p>
                    <p className="text-gray-600 line-clamp-3">{listing.description}</p>
                    <div className="text-sm text-gray-500">
                      {listing.city}, {listing.district} • {listing.condition}
                    </div>
                    <div className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary">
                      {listing.status}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
