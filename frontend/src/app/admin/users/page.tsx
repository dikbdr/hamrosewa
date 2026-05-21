'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsers, updateUserRole } from '@/services/adminService';

type UserItem = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  emailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const loadUsers = async () => {
      try {
        const response = await fetchUsers(token);
        setUsers(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [router, token]);

  const handleRoleChange = async (userId: string, role: string) => {
    if (!token) return;
    try {
      await updateUserRole(token, userId, role);
      setMessage('User role updated successfully.');
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
    } catch {
      setError('Unable to update user role.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-2">Admin User Management</h1>
          <p className="text-gray-600">Manage user roles and site accounts from a single place.</p>
        </div>

        {message && <div className="rounded-3xl bg-green-50 border border-green-200 p-6 text-green-700">{message}</div>}
        {error && <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-lg font-medium">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
            <p className="text-gray-600">No users found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {users.map((user) => (
              <div key={user.id} className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{user.firstName || user.email}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-secondary/10 px-3 py-2 text-sm text-secondary">{user.role}</span>
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      className="rounded-2xl border border-gray-200 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="USER">USER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
