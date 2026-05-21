'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categoryService';

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load categories.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Browse Categories</h1>
          <p className="text-gray-600">Explore all available product categories on HamroSewa.</p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading categories...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-white border border-red-200 p-6 shadow-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
                <p className="text-gray-600">No categories found.</p>
              </div>
            ) : (
              categories.map((category) => (
                <article key={category.id} className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/10 text-2xl flex items-center justify-center text-secondary">
                      {category.icon || category.name[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description || 'No description provided.'}</p>
                  {category.image && (
                    <img src={category.image} alt={category.name} className="h-44 w-full rounded-3xl object-cover" />
                  )}
                  <div className="mt-6">
                    <Link
                      href={`/categories/${encodeURIComponent(category.slug)}`}
                      className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-orange-500 transition"
                    >
                      View category
                    </Link>
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
