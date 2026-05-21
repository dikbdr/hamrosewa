'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { fetchCategories } from '@/services/categoryService';
import { fetchListings, ListingSearchFilters } from '@/services/listingService';

type CategoryPayload = {
  id: string;
  name: string;
  slug: string;
};

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

export default function SearchPage() {
  const [categories, setCategories] = useState<CategoryPayload[]>([]);
  const [listings, setListings] = useState<ListingPayload[]>([]);
  const [filters, setFilters] = useState<ListingSearchFilters>({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryResponse, listingResponse] = await Promise.all([
          fetchCategories(),
          fetchListings(),
        ]);

        setCategories(categoryResponse.data.data);
        setListings(listingResponse.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load search results.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchLoading(true);
    setError(null);

    try {
      const response = await fetchListings(filters);
      setListings(response.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to apply search filters.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Search & Filter Listings</h1>
          <p className="text-gray-600">Refine your search with category, location, price, and condition filters.</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <form className="grid gap-4 xl:grid-cols-[1.5fr_1fr]" onSubmit={handleSearch}>
            <div className="space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium">Search</span>
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search by title or description"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">City</span>
                  <input
                    type="text"
                    value={filters.city || ''}
                    onChange={(event) => setFilters({ ...filters, city: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">District</span>
                  <input
                    type="text"
                    value={filters.district || ''}
                    onChange={(event) => setFilters({ ...filters, district: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Min Price</span>
                  <input
                    type="number"
                    value={filters.minPrice ?? ''}
                    onChange={(event) => setFilters({ ...filters, minPrice: event.target.value ? Number(event.target.value) : undefined })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Max Price</span>
                  <input
                    type="number"
                    value={filters.maxPrice ?? ''}
                    onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : undefined })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium">Category</span>
                <select
                  value={filters.category || ''}
                  onChange={(event) => setFilters({ ...filters, category: event.target.value || undefined })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Condition</span>
                <select
                  value={filters.condition || ''}
                  onChange={(event) => setFilters({ ...filters, condition: event.target.value || undefined })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any condition</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="USED">Used</option>
                  <option value="NOT_WORKING">Not Working</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Status</span>
                <select
                  value={filters.status || ''}
                  onChange={(event) => setFilters({ ...filters, status: event.target.value || undefined })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Active only</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SOLD">Sold</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="DELETED">Deleted</option>
                  <option value="FLAGGED">Flagged</option>
                </select>
              </label>

              <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={filters.featured ?? false}
                  onChange={(event) => setFilters({ ...filters, featured: event.target.checked ? true : undefined })}
                />
                <span className="text-sm">Featured only</span>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-4 py-3 text-white font-semibold hover:bg-orange-500 transition"
              >
                {searchLoading ? 'Searching...' : 'Search listings'}
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading listings...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-red-200 p-6 shadow-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
                <p className="text-gray-600">No listings match your filters.</p>
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
