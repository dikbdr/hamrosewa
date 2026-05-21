'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCategory } from '@/services/categoryService';
import { fetchListings } from '@/services/listingService';

type CategoryPayload = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ListingPayload = {
  id: string;
  title: string;
  slug: string;
  price: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  city: string;
  district: string;
  status: string;
  images: { id: string; url: string }[];
};

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<CategoryPayload | null>(null);
  const [listings, setListings] = useState<ListingPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const [categoryResponse, listingsResponse] = await Promise.all([
          fetchCategory(slug),
          fetchListings({ category: slug }),
        ]);

        setCategory(categoryResponse.data.data);
        setListings(listingsResponse.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load category details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
        <div className="container mx-auto rounded-3xl bg-white p-10 shadow-lg text-center">
          <p className="text-lg font-medium">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
        <div className="container mx-auto rounded-3xl bg-white p-10 shadow-lg text-center text-red-700">
          <p>{error || 'Category not found.'}</p>
          <Link href="/categories" className="mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 text-white hover:bg-orange-500 transition">
            Back to categories
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
              <h1 className="text-3xl font-semibold">{category.name}</h1>
              <p className="text-gray-600 mt-2">{category.description || 'Explore listings for this category.'}</p>
            </div>
            <Link href="/categories" className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-orange-500 transition">
              Back to categories
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Listings in {category.name}</h2>
          {listings.length === 0 ? (
            <div className="rounded-3xl bg-gray-50 p-8 text-center">
              <p className="text-gray-600">No active listings are available for this category yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <article key={listing.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl transition">
                  {listing.images[0] && (
                    <img src={listing.images[0].url} alt={listing.title} className="mb-4 h-48 w-full rounded-3xl object-cover" />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{listing.city}, {listing.district}</p>
                  <p className="text-lg font-semibold">₹{listing.price.toLocaleString()}</p>
                  <div className="mt-6">
                    <Link href={`/listings/${listing.id}`} className="inline-flex items-center justify-center rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary/90 transition">
                      View listing
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
