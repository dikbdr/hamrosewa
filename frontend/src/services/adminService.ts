import axios from 'axios';

type AdminOverviewPayload = {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalPayments: number;
  totalChats: number;
  unreadNotifications: number;
};

type UserPayload = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  emailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAdminOverview = async (token: string) => {
  return api.get<{ data: AdminOverviewPayload }>('/admin/overview', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchUsers = async (token: string) => {
  return api.get<{ data: UserPayload[] }>('/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserRole = async (token: string, userId: string, role: string) => {
  return api.patch(`/admin/users/${userId}/role`, { role }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const reviewListing = async (token: string, listingId: string, status: string) => {
  return api.patch(`/admin/listings/${listingId}/review`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchAdminReports = async (token: string) => {
  return api.get<{ data: { recentUsers: any[]; recentPayments: any[]; recentListings: any[] } }>('/admin/reports', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
