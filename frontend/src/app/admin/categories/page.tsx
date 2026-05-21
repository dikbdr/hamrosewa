'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '@/services/categoryService';

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', icon: '', isActive: true });
  const [message, setMessage] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      setError('Admin token is required to manage categories. Please log in first.');
      setLoading(false);
      return;
    }

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
  }, [token]);

  const refreshCategories = async () => {
    if (!token) return;
    try {
      const response = await fetchCategories();
      setCategories(response.data.data);
    } catch {
      setError('Unable to refresh category list.');
    }
  };

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError('Admin token is required.');
      return;
    }

    try {
      await createCategory(token, {
        name: form.name,
        description: form.description || undefined,
        image: form.image || undefined,
        icon: form.icon || undefined,
        isActive: form.isActive,
      });
      setMessage('Category created successfully.');
      setForm({ name: '', description: '', image: '', icon: '', isActive: true });
      await refreshCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleDeactivate = async (categoryId: string) => {
    if (!token) {
      setError('Admin token is required.');
      return;
    }

    try {
      await deleteCategory(token, categoryId);
      setMessage('Category deactivated successfully.');
      await refreshCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to deactivate category.');
    }
  };

  const handleToggleActive = async (category: CategoryPayload) => {
    if (!token) {
      setError('Admin token is required.');
      return;
    }

    try {
      await updateCategory(token, category.id, { isActive: !category.isActive });
      setMessage(`${category.name} is now ${category.isActive ? 'inactive' : 'active'}.`);
      await refreshCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to update category.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium">Loading admin category tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Admin Category Management</h1>
          <p className="text-gray-600">Create, update, and deactivate categories for HamroSewa.</p>
        </div>

        {error && <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>}
        {message && <div className="rounded-3xl bg-green-50 border border-green-200 p-6 text-green-700">{message}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create New Category</h2>
            <form className="space-y-4" onSubmit={handleCreateCategory}>
              <label className="space-y-2">
                <span className="text-sm font-medium">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Image URL</span>
                  <input
                    value={form.image}
                    onChange={(event) => setForm({ ...form, image: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Icon</span>
                  <input
                    value={form.icon}
                    onChange={(event) => setForm({ ...form, icon: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                />
                <span className="text-sm">Is active</span>
              </label>
              <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-white font-semibold hover:bg-orange-500 transition">
                Create category
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Category List</h2>
            <div className="space-y-4">
              {categories.length === 0 ? (
                <p className="text-gray-600">No categories available.</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                        <p className="text-sm text-gray-600">{category.description || 'No description'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(category)}
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          {category.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeactivate(category.id)}
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
