import axios from 'axios';

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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCategories = async () => {
  return api.get<{ data: CategoryPayload[] }>('/categories');
};

export const createCategory = async (token: string, payload: {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
}) => {
  return api.post('/categories', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCategory = async (token: string, categoryId: string, payload: {
  name?: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
}) => {
  return api.patch(`/categories/${categoryId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCategory = async (token: string, categoryId: string) => {
  return api.delete(`/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
