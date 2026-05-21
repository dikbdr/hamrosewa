'use client';

import { FormEvent, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categoryService';
import {
  createListing,
  deleteListing,
  fetchListings,
  updateListing,
} from '@/services/listingService';

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
  status: string;
  category?: CategoryPayload;
};

export default function AdminListingsPage() {
  const [categories, setCategories] = useState<CategoryPayload[]>([]);
  const [listings, setListings] = useState<ListingPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: 0,
    negotiable: false,
    condition: 'USED',
    city: '',
    district: '',
    address: '',
    sellerEmail: '',
    sellerPhone: '',
    expiresAt: '',
    images: '',
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      setError('Admin token is required to manage listings. Please log in first.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [categoryResponse, listingResponse] = await Promise.all([
          fetchCategories(),
          fetchListings(),
        ]);

        setCategories(categoryResponse.data.data);
        setListings(listingResponse.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load listings.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const refreshListings = async () => {
    if (!token) return;
    try {
      const response = await fetchListings();
      setListings(response.data.data);
    } catch {
      setError('Unable to refresh listing collection.');
    }
  };

  const handleCreateListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError('Admin token is required.');
      return;
    }

    if (!form.categoryId) {
      setError('Please select a category for the listing.');
      return;
    }

    try {
      await createListing(token, {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        price: form.price,
        negotiable: form.negotiable,
        condition: form.condition,
        city: form.city,
        district: form.district,
        address: form.address || undefined,
        sellerEmail: form.sellerEmail || undefined,
        sellerPhone: form.sellerPhone || undefined,
        expiresAt: form.expiresAt || undefined,
        images: form.images ? form.images.split(',').map((url) => url.trim()) : undefined,
      });
      setMessage('Listing created successfully.');
      setForm({
        title: '',
        description: '',
        categoryId: '',
        price: 0,
        negotiable: false,
        condition: 'USED',
        city: '',
        district: '',
        address: '',
        sellerEmail: '',
        sellerPhone: '',
        expiresAt: '',
        images: '',
      });
      await refreshListings();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create listing.');
    }
  };

  const handleDeactivate = async (listingId: string) => {
    if (!token) {
      setError('Admin token is required.');
      return;
    }

    try {
      await deleteListing(token, listingId);
      setMessage('Listing deactivated successfully.');
      await refreshListings();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to deactivate listing.');
    }
  };

  const handleToggleActive = async (listing: ListingPayload) => {
    if (!token) {
      setError('Admin token is required.');
      return;
    }

    try {
      await updateListing(token, listing.id, {
        status: listing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      setMessage(`${listing.title} is now ${listing.status === 'ACTIVE' ? 'inactive' : 'active'}.`);
      await refreshListings();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to update listing.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium">Loading admin listing tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Admin Listing Management</h1>
          <p className="text-gray-600">Create and manage product listings for the marketplace.</p>
        </div>

        {error && <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>}
        {message && <div className="rounded-3xl bg-green-50 border border-green-200 p-6 text-green-700">{message}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create New Listing</h2>
            <form className="space-y-4" onSubmit={handleCreateListing}>
              <label className="space-y-2">
                <span className="text-sm font-medium">Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Price</span>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">City</span>
                  <input
                    required
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">District</span>
                  <input
                    required
                    value={form.district}
                    onChange={(event) => setForm({ ...form, district: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Seller Email</span>
                  <input
                    value={form.sellerEmail}
                    onChange={(event) => setForm({ ...form, sellerEmail: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Seller Phone</span>
                  <input
                    value={form.sellerPhone}
                    onChange={(event) => setForm({ ...form, sellerPhone: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium">Expires At</span>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) => setForm({ ...form, expiresAt: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Image URLs (comma separated)</span>
                <input
                  value={form.images}
                  onChange={(event) => setForm({ ...form, images: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.negotiable}
                    onChange={(event) => setForm({ ...form, negotiable: event.target.checked })}
                  />
                  <span className="text-sm">Negotiable price</span>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Condition</span>
                  <select
                    value={form.condition}
                    onChange={(event) => setForm({ ...form, condition: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="USED">Used</option>
                    <option value="NOT_WORKING">Not Working</option>
                  </select>
                </label>
              </div>

              <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-white font-semibold hover:bg-orange-500 transition">
                Create listing
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Listing Queue</h2>
            <div className="space-y-4">
              {listings.length === 0 ? (
                <p className="text-gray-600">No listings created yet.</p>
              ) : (
                listings.map((listing) => (
                  <div key={listing.id} className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{listing.title}</h3>
                        <p className="text-sm text-gray-500">{listing.category?.name || 'No category'}</p>
                        <p className="text-sm text-gray-500">Rs {listing.price.toFixed(0)} · {listing.status}</p>
                        <p className="text-sm text-gray-500">{listing.city}, {listing.district}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(listing)}
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          {listing.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeactivate(listing.id)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
